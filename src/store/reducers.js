import { createReducer } from '@reduxjs/toolkit';

import { authLogin, authLogout, tweetsList, uiResetError } from './actions';
import {
  TWEETS_CREATED_SUCCESS,
  TWEETS_DETAIL_SUCCESS,
  TWEETS_LOADED_SUCCESS,
} from './types';

export const defaultState = {
  auth: false,
  tweets: {
    areLoaded: false,
    data: [],
  },
  ui: {
    isFetching: false,
    error: null,
  },
};


export const auth = createReducer(defaultState.auth, builder => {
  builder
    .addCase(authLogin.fulfilled, () => true)
    .addCase(authLogout.fulfilled, () => false);
});

// export function tweets(state = defaultState.tweets, action) {
//   switch (action.type) {
//     case tweetsList.fulfilled.type:
//       return { areLoaded: true, data: action.payload };

//     case TWEETS_DETAIL_SUCCESS:
//       return { areLoaded: false, data: [action.payload] };

//     case TWEETS_CREATED_SUCCESS:
//       return { ...state, data: [action.payload, ...state.data] };

//     default:
//       return state;
//   }
// }

export const tweets = createReducer(defaultState.tweets, builder => {
  builder
    .addCase(tweetsList.fulfilled, (state, action) => {
      state.areLoaded = true;
      state.data = action.payload;
    })
    .addCase(TWEETS_DETAIL_SUCCESS, (state, action) => {
      state.areLoaded = false;
      state.data = [action.payload];
    })
    .addCase(TWEETS_CREATED_SUCCESS, (state, action) => {
      state.data.unshift(action.payload);
    });
});


const isActionError = action => action.error;
const isRequestAction = action => action.type.endsWith('/pending');
const isSuccessAction = action => action.type.endsWith('/fulfilled');

export const ui = createReducer(defaultState.ui, builder => {
  builder
    .addCase(uiResetError, state => {
      state.error = null;
    })
    .addMatcher(isActionError, (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    })
    .addMatcher(isRequestAction, state => {
      state.isFetching = true;
      state.error = null;
    })
    .addMatcher(isSuccessAction, state => {
      state.isFetching = false;
      state.error = null;
    });
});

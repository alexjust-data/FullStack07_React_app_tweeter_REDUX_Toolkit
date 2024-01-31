import { createReducer } from '@reduxjs/toolkit';

import { authLoginSuccess, authLogout, uiResetError } from './actions';
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

// export function auth(state = defaultState.auth, action) {
//   switch (action.type) {
//     case AUTH_LOGIN_SUCCESS:
//       return true;
//     case AUTH_LOGOUT:
//       return false;
//     default:
//       return state;
//   }
// }

export const auth = createReducer(defaultState.auth, builder => {
  builder
    .addCase(authLoginSuccess, () => true)
    .addCase(authLogout, () => false);
});

export function tweets(state = defaultState.tweets, action) {
  switch (action.type) {
    case TWEETS_LOADED_SUCCESS:
      return { areLoaded: true, data: action.payload };

    case TWEETS_DETAIL_SUCCESS:
      return { areLoaded: false, data: [action.payload] };

    case TWEETS_CREATED_SUCCESS:
      return { ...state, data: [action.payload, ...state.data] };

    default:
      return state;
  }
}

// export function ui(state = defaultState.ui, action) {
//   if (action.error) {
//     return { isFetching: false, error: action.payload };
//   }

//   if (action.type.endsWith('/request')) {
//     return { isFetching: true, error: null };
//   }

//   if (action.type.endsWith('/success')) {
//     return { isFetching: false, error: null };
//   }

//   if (action.type === uiResetError.type) {
//     return { ...state, error: null };
//   }

//   return state;
// }

const isActionError = action => action.error;
const isRequestAction = action => action.type.endsWith('/request');
const isSuccessAction = action => action.type.endsWith('/success');

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

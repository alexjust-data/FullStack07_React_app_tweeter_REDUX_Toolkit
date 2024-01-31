import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { areTweetsLoaded, getTweet } from './selectors';
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  TWEETS_CREATED_REQUEST,
  TWEETS_CREATED_SUCCESS,
  TWEETS_CREATED_FAILURE,
  TWEETS_DETAIL_FAILURE,
  TWEETS_DETAIL_REQUEST,
  TWEETS_DETAIL_SUCCESS,
  TWEETS_LOADED_FAILURE,
  TWEETS_LOADED_REQUEST,
  TWEETS_LOADED_SUCCESS,
} from './types';


export const authLogin = createAsyncThunk(
  'auth/login',
  (
    credentials,
    {
      extra: {
        api: { auth },
        router,
      },
      rejectWithValue,
    },
  ) =>
    auth
      .login(credentials)
      .then(() => {
        const to = router.state.location.state?.from?.pathname || '/';
        router.navigate(to);
      })
      .catch(rejectWithValue),
);

export const authLogout = createAsyncThunk(
  'auth/logout',
  (
    _,
    {
      extra: {
        api: { auth },
      },
    },
  ) => auth.logout(),
);

export const tweetsLoadedRequest = () => ({
  type: TWEETS_LOADED_REQUEST,
});

export const tweetsLoadedSuccess = tweets => ({
  type: TWEETS_LOADED_SUCCESS,
  payload: tweets,
});

export const tweetsLoadedFailure = error => ({
  type: TWEETS_LOADED_FAILURE,
  error: true,
  payload: error,
});

export function loadTweets() {
  return async function (dispatch, getState, { api: { tweets } }) {
    if (areTweetsLoaded(getState())) {
      return;
    }

    try {
      dispatch(tweetsLoadedRequest());
      const tweetsList = await tweets.getLatestTweets();
      dispatch(tweetsLoadedSuccess(tweetsList));
    } catch (error) {
      dispatch(tweetsLoadedFailure(error));
    }
  };
}

export const tweetsDetailRequest = () => ({
  type: TWEETS_DETAIL_REQUEST,
});

export const tweetsDetailSuccess = tweet => ({
  type: TWEETS_DETAIL_SUCCESS,
  payload: tweet,
});

export const tweetsDetailFailure = error => ({
  type: TWEETS_DETAIL_FAILURE,
  error: true,
  payload: error,
});

export function detailTweets(tweetId) {
  return async function (dispatch, getState, { api: { tweets } }) {
    if (getTweet(tweetId)(getState())) {
      return;
    }

    try {
      dispatch(tweetsDetailRequest());
      const tweet = await tweets.getTweet(tweetId);
      dispatch(tweetsDetailSuccess(tweet));
    } catch (error) {
      dispatch(tweetsDetailFailure(error));
    }
  };
}

export const tweetsCreatedRequest = () => ({
  type: TWEETS_CREATED_REQUEST,
});

export const tweetsCreatedSuccess = tweet => ({
  type: TWEETS_CREATED_SUCCESS,
  payload: tweet,
});

export const tweetsCreatedFailure = error => ({
  type: TWEETS_CREATED_FAILURE,
  error: true,
  payload: error,
});

export function createTweet(tweet) {
  return async function (dispatch, _getState, { api: { tweets }, router }) {
    try {
      dispatch(tweetsCreatedRequest());
      const { id } = await tweets.createTweet(tweet);
      // To complete tweet info
      const createdTweet = await tweets.getTweet(id);
      dispatch(tweetsCreatedSuccess(createdTweet));
      router.navigate(`/tweets/${createdTweet.id}`);
    } catch (error) {
      dispatch(tweetsCreatedFailure(error));
    }
  };
}

export const uiResetError = createAction('ui/reset_error');
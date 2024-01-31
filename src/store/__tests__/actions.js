import {
  authLogin,
  authLoginFailure,
  authLoginRequest,
  authLoginSuccess,
  tweetsLoadedSuccess,
} from '../actions';
import { AUTH_LOGIN_SUCCESS, TWEETS_LOADED_SUCCESS } from '../types';

describe('authLoginSuccess', () => {
  test('should return an "AUTH_LOGIN_SUCCESS" action', () => {
    const expectedAction = {
      type: AUTH_LOGIN_SUCCESS,
    };
    const action = authLoginSuccess();
    expect(action).toEqual(expectedAction);
  });
});

describe('tweetsLoadedSuccess', () => {
  it('should return a "TWEETS_LOADED_SUCCESS" action with payload', () => {
    const tweets = 'tweets';
    const expectedAction = {
      type: TWEETS_LOADED_SUCCESS,
      payload: tweets,
    };
    const action = tweetsLoadedSuccess(tweets);
    expect(action).toEqual(expectedAction);
  });
});

describe('authLogin', () => {
  const credentials = 'credentials';
  const action = authLogin(credentials);

  const redirectUrl = 'redirectUrl';
  const dispatch = jest.fn();
  const api = { auth: {} };
  const router = {
    state: { location: { state: { from: { pathname: redirectUrl } } } },
    navigate: jest.fn(),
  };

  test('when login resolves should follow the login flow', async () => {
    api.auth.login = jest.fn().mockResolvedValue();
    await action(dispatch, undefined, { api, router });

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, authLoginRequest());
    expect(api.auth.login).toHaveBeenCalledWith(credentials);
    expect(dispatch).toHaveBeenNthCalledWith(2, authLoginSuccess());
    expect(router.navigate).toHaveBeenCalledWith(redirectUrl);
  });

  test('when login rejects should follow the error flow', async () => {
    const error = new Error('unauthorized');
    api.auth.login = jest.fn().mockRejectedValue(error);
    await action(dispatch, undefined, { api, router });

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, authLoginRequest());
    expect(api.auth.login).toHaveBeenCalledWith(credentials);
    expect(dispatch).toHaveBeenNthCalledWith(2, authLoginFailure(error));
    expect(router.navigate).not.toHaveBeenCalledWith(redirectUrl);
  });
});

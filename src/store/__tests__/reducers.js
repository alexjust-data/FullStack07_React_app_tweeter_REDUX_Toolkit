import { authLoginSuccess, authLogout, tweetsCreatedRequest } from '../actions';
import { auth, defaultState } from '../reducers';

describe('auth', () => {
  test('should manage "AUTH_LOGIN_SUCCESS" action', () => {
    const state = defaultState.auth;
    const action = authLoginSuccess();
    expect(auth(state, action)).toBe(true);
  });
  test('should manage "AUTH_LOGOUT" action', () => {
    const state = defaultState.auth;
    const action = authLogout();
    expect(auth(state, action)).toBe(false);
  });
  test('should manage "ANY" action', () => {
    const state = defaultState.auth;
    const action = tweetsCreatedRequest();
    expect(auth(state, action)).toBe(state);
  });
  test('should manage "ANY" action when state is not defined', () => {
    const state = undefined;
    const action = tweetsCreatedRequest();
    expect(auth(state, action)).toBe(defaultState.auth);
  });
});

/* @flow */

import { createReducer, createAction } from 'redux-act';
import { createAsyncAction } from './async-actions';
import { makeRequest } from './request';
import { saveToStorage, removeFromStorage } from 'utils/localStorage';

import { clearMyBooks } from './books';
import { clearTrade } from './trade';

import { LoginCredentials, SignupCredentials } from 'types/auth';

export const changeAuthName = createAction('CHANGE_AUTH_NAME');

const authHandling = (user) => {
  const newUser = {
    ...user,
    isLoggedIn: true,
  };

  saveToStorage(newUser);
  return newUser;
};

const _login = createAsyncAction(
  'LOGIN',
  function(credentials: LoginCredentials) {
    return makeRequest('POST', '/api/auth/login', credentials).then(resp => authHandling(resp.body));
  }
);
export const login = _login.perform;
export const clearLoginErrors = _login.clearError;

const _logout = createAsyncAction(
  'LOGOUT',
  function() {
    const { dispatch } = this;

    return makeRequest('GET', '/api/auth/logout').then(() => {
      if (typeof window != 'undefined') {
        removeFromStorage(['name', 'username']);
        saveToStorage({ isLoggedIn: false });
      }

      dispatch(clearMyBooks());
      dispatch(clearTrade());
    });
  }
);
export const logout = _logout.perform;

const _signup = createAsyncAction(
  'SIGNUP',
  function(credentials: SignupCredentials) {
    return makeRequest('POST', '/api/auth/signup', credentials).then(resp => authHandling(resp.body));
  }
);

export const signup = _signup.perform;
export const clearSignupErrors = _signup.clearError;

export const authAsync = {
  login: _login,
  logout: _logout,
  signup: _signup,
};

const reducer = createReducer({
  [_login.success]: (state, user) => ({
    ...state,
    ...user,
  }),
  [_logout.success]: () => ({
    isLoggedIn: false,
  }),
  [_signup.success]: (state, user) => ({
    ...state,
    ...user,
  }),
  [changeAuthName]: (state, name) => ({
    ...state,
    name,
  }),
}, {});

export default reducer;

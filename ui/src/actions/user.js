/* @flow */

import { createAsyncAction } from './async-actions';
import { makeRequest } from './request';
import { saveToStorage } from 'utils/localStorage';

import { changeAuthName } from './auth';

type Credentials = {
  newPassword: string,
  oldPassword: string,
};

const _changeName = createAsyncAction(
  'CHANGE_NAME',
  function(name: string) {
    const { dispatch } = this;
    return makeRequest('POST', '/api/user/name', { name }).then(() => {
      dispatch(changeAuthName(name));
      saveToStorage({ name });
    });
  }
);

export const changeName = _changeName.perform;
export const clearChangeNameErrors = _changeName.clearError;

const _changePassword = createAsyncAction(
  'CHANGE_PASSWORD',
  function(credentials: Credentials) {
    return makeRequest('POST', '/api/user/password', { ...credentials });
  }
);

export const changePassword = _changePassword.perform;
export const clearChangePassErrors = _changePassword.clearError;

export const userAsync = {
  changeName: _changeName,
  changePassword: _changePassword,
};

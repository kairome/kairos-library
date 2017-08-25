/* @flow */

import { createAction } from 'redux-act';

export function createAsyncAction(type: string, action: Function) {
  const start = createAction(`${type}_STARTED`);
  const success = createAction(`${type}_FINISHED`);
  const fail = createAction(`${type}_FAILED`);
  const clearError = createAction(`${type}_CLEAR_ERROR`);

  const perform = (...payload: any) => (dispatch: Function, getState: Function) => {
    dispatch(start());
    const a = action.bind({ dispatch, getState });

    // return Promise.resolve(a(...payload)).then((resp) => {
    //   dispatch(success(resp));
    //   return resp;
    // }).catch((err) => {
    //   dispatch(fail(err));
    //   console.log('dispatching error');
    // });
    return a(...payload).then((resp) => {
      dispatch(success(resp));
      return resp;
    }).catch((err) => {
      dispatch(fail(err));
      throw err;
    });
  };

  return {
    start,
    success,
    fail,
    clearError,
    perform,
  };
}

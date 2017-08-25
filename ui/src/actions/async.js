/* @flow */

import { createReducer } from 'redux-act';
import _ from 'lodash';

import { authAsync } from './auth';
import { bookAsync } from './books';
import { searchAsync } from './search';
import { userAsync } from './user';
import { tradeAsync } from './trade';

const allAsyncActions = (...args) => {
  const actions = {};
  _.forEach(args, (asyncAction) => {
    const keys = Object.keys(asyncAction);
    _.forEach(keys, (key) => {
      actions[asyncAction[key].start] = state => ({
        ...state,
        [key]: {
          err: null,
          finished: false,
          isLoading: true,
        },
      });

      actions[asyncAction[key].success] = state => ({
        ...state,
        [key]: {
          err: null,
          finished: true,
          isLoading: false,
        },
      });

      actions[asyncAction[key].fail] = (state, err) => ({
        ...state,
        [key]: {
          err,
          finished: true,
          isLoading: false,
        },
      });

      actions[asyncAction[key].clearError] = state => ({
        ...state,
        [key]: {
          ...state[key],
          err: null,
        },
      });
    });
  });

  return actions;
};

const allActions = allAsyncActions(authAsync, bookAsync, searchAsync, userAsync, tradeAsync);

const reducer = createReducer({
  ...allActions,
}, {});

export default reducer;

/* @flow */

import { createAsyncAction } from './async-actions';
import { createReducer } from 'redux-act';

import { makeRequest } from './request';

const _search = createAsyncAction(
  'SEARCH_FOR_BOOKS',
  function(query: string) {
    return makeRequest('POST', '/api/books/search', { query })
      .then(resp => resp.body);
  }
);
export const search = _search.perform;
export const clearSearchErrors = _search.clearError;

export const searchAsync = {
  search: _search,
};

const initialPayload = {
  results: [],
};

const reducer = createReducer({
  [_search.success]: (state, books) => ({
    ...state,
    results: books,
  }),
}, initialPayload);

export default reducer;

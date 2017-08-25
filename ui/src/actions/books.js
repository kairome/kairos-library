/* @flow */

import { createAsyncAction } from './async-actions';
import { createAction, createReducer } from 'redux-act';
import { makeRequest } from './request';

export const toggleBookModal = createAction('TOGGLE_BOOK_MODAL');
export const toggleLoanedBookModal = createAction('TOGGLE_LOANED_BOOK_MODAL');
export const closeLoanedBookModal = createAction('ClOSE_LOANED_BOOK_MODAL');
export const clearMyBooks = createAction('CLEAR_MY_BOOKS');

const _addBook = createAsyncAction(
  'ADD_BOOK',
  function(id: string) {
    return makeRequest('POST', `/api/book/${id}`)
      .then(resp => resp.body);
  }
);
export const addBook = _addBook.perform;
export const clearAddErrors = _addBook.clearError;

const _fetchAllBooks = createAsyncAction(
  'FETCH_All_BOOKS',
  function() {
    return makeRequest('GET', '/api/books')
      .then(resp => resp.body);
  }
);

export const fetchAllBooks = _fetchAllBooks.perform;
export const clearFetchAllErrors = _fetchAllBooks.clearError;

const _fetchMyBooks = createAsyncAction(
  'FETCH_MY_BOOKS',
  function() {
    return makeRequest('GET', '/api/books/my')
      .then(resp => resp.body);
  }
);

export const fetchMyBooks = _fetchMyBooks.perform;
export const clearFetchMyErrors = _fetchMyBooks.clearError;

const _removeBook = createAsyncAction(
  'REMOVE_BOOK',
  function(id: string) {
    return makeRequest('DELETE', `/api/book/${id}`);
  }
);

export const removeBook = _removeBook.perform;
export const clearRemoveErrors = _removeBook.clearError;

const _fetchDueTime = createAsyncAction(
  'FETCH_DUE_TIME',
  function(id: string, owner: string) {
    return makeRequest('GET', `/api/book/due/${id}/${owner}`).then(resp => resp.body);
  }
);

export const fetchDueTime = _fetchDueTime.perform;
export const clearFetchDueTimeErrors = _fetchDueTime.clearError;

export const bookAsync = {
  addBook: _addBook,
  removeBook: _removeBook,
  fetchAllBooks: _fetchAllBooks,
  fetchMyBooks: _fetchMyBooks,
  fetchDueTime: _fetchDueTime,
};

const initialState = {
  my: [],
  showBookModal: false,
  showLoanedBookModal: false,
};

const reducer = createReducer({
  [_fetchAllBooks.success]: (state, result) => ({
    ...state,
    all: result,
  }),
  [_fetchMyBooks.success]: (state, result) => ({
    ...state,
    my: result,
  }),
  [toggleBookModal]: (state) => {
    const current = state.showBookModal;

    return {
      ...state,
      showBookModal: !current,
    };
  },
  [toggleLoanedBookModal]: (state) => {
    const current = state.showLoanedBookModal;

    return {
      ...state,
      showLoanedBookModal: !current,
    };
  },
  [closeLoanedBookModal]: state => ({
    ...state,
    showLoanedBookModal: false,
  }),
  [clearMyBooks]: state => ({
    ...state,
    my: [],
  }),
}, initialState);

export default reducer;

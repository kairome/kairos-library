/* @flow */

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import search from './search';
import books from './books';
import auth from './auth';
import async from './async';
import trade from './trade';

const reducer = combineReducers({
  async,
  search,
  books,
  trade,
  auth,
  router: routerReducer,
});

export default reducer;

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { getInitialState } from 'utils/state';

import 'css/global.css';

import reducers from './actions';

import App from './app';

const history = createHistory();

export const middlewares = [
  thunk,
  routerMiddleware(history),
];

if (process.env.NODE_ENV == 'development') {
  middlewares.push(createLogger({
    predicate: (getState, action) => typeof action !== 'function',
    collapsed: true,
  }));
}

const store = createStore(
  reducers,
  getInitialState(),
  applyMiddleware(...middlewares)
);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);

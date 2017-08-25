import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './actions/index';
import { getInitialState } from 'utils/state';

import App from './app';
import { Provider } from 'react-redux';

import 'css/global.css';

const store = createStore(
  reducers,
  getInitialState(),
  applyMiddleware(thunk)
);

export const renderReact = (url, context) => {
  const appHtml = renderToString(
    <Provider store={store}>
      <StaticRouter location={url} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  );

  return appHtml;
};

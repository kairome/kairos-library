/* @flow */

import React from 'react';

import routes from './routes';

import Library from 'components/library/library';

const App = () => (
  <Library>
    {routes}
  </Library>
);

export default App;

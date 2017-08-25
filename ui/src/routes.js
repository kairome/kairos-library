import React from 'react';
import { Switch, Route } from 'react-router-dom';

// components
import Home from 'components/home/home';
import MyBooks from 'components/books/my-books';
import AllBooks from 'components/books/all-books';
import Login from 'components/auth/login';
import Signup from 'components/auth/signup';
import Settings from 'components/settings/settings';
import Trade from 'components/trade/trade';
import Page404 from 'components/page-404/page-404';

const routes = (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/books/my" component={MyBooks} />
    <Route exact path="/books/all" component={AllBooks} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/signup" component={Signup} />
    <Route exact path="/settings" component={Settings} />
    <Route exact path="/trade" component={Trade} />
    <Route component={Page404} />
  </Switch>
);

export default routes;

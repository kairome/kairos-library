/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// components
import { Link, Redirect } from 'react-router-dom';
import Input from 'components/input/input';
import Form from 'components/form/form';
import Button from 'components/button/button';
import Error from 'components/error/error';
import Loading from 'components/animations/loading';

// actions
import { login, clearLoginErrors } from 'actions/auth';
import { push } from 'react-router-redux';

import type { AsyncState } from 'types/async';
import type { LoginCredentials } from 'types/auth';

import s from './auth.css';

type Props = {
  isLoggedIn: boolean,
  loginState: AsyncState,
  login: (c: LoginCredentials) => Promise<*>,
  push: (path: string) => void,
  clearLoginErrors: () => void,
};

type State = {
  email: string,
  password: string,
};

class Login extends Component<Props, State> {
  state = {
    email: '',
    password: '',
  };

  componentWillMount() {
    if (this.props.isLoggedIn) {
      this.props.push('/')
    }
  }

  componentWillUnmount() {
    this.props.clearLoginErrors();
  }

  handleEmail = ({target}: SyntheticInputEvent<*>) => {
    this.setState({ email: target.value });
  }

  handlePassword = ({target}: SyntheticInputEvent<*>) => {
    this.setState({ password: target.value });
  }

  handleSubmit = (e: SyntheticEvent<*>) => {
    e.preventDefault();
    const { email, password } = this.state;
    this.props.login({ email, password })
      .then(() => {
        this.props.push('/books/my');
      });
  }

  get loading() {
    if (!this.props.loginState.isLoading) return null;

    return <Loading />;
  }

  render() {
    const { loginState } = this.props;

    return (
      <div className={s.formWrapper}>
        <Form onSubmit={this.handleSubmit}>
          <div className={s.header}>Login</div>
          <Error error={loginState.err} />
          {this.loading}
          <Input
           required
           type="email"
           name="email"
           onChange={this.handleEmail}
           placeholder="Enter your email"
          />
          <Input
           required
           type="password"
           name="password"
           onChange={this.handlePassword}
           placeholder="Enter your password"
          />
          <div className={s.redirectLink}>
            Don't have an account yet? <Link to="/signup">Signup</Link>
          </div>
          <Button
            type="submit"
            text="Login"
            className={s.authButton}
          />
        </Form>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    isLoggedIn: _.get(state.auth, 'isLoggedIn', false),
    loginState: _.get(state.async, 'login', {}),
  };
};

export default connect(mapState, {
  login,
  push,
  clearLoginErrors,
})(Login);

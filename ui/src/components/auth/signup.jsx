/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { confirmPassword, checkWhiteSpace } from 'utils/validation';

// components
import { Link } from 'react-router-dom';
import Input from 'components/input/input';
import Form from 'components/form/form';
import Button from 'components/button/button';
import Error from 'components/error/error';
import Loading from 'components/animations/loading';

// actions
import { signup, clearSignupErrors } from 'actions/auth';
import { push } from 'react-router-redux';

import type { AsyncState } from 'types/async';
import type { SignupCredentials } from 'types/auth';

import s from './auth.css';

type Props = {
  isLoggedIn: boolean,
  signupState: AsyncState,
  signup: (c: SignupCredentials) => Promise<*>,
  clearSignupErrors: () => void,
  push: (path: string) => void,
};

type State = {
  name: string,
  email: string,
  password: string,
  username: string,
  confirm: string,
};

class Signup extends Component<Props, State> {
  nameInput: ?HTMLElement;
  usernameInput: ?HTMLElement;
  confirmPasswordInput: ?HTMLElement;

  state = {
    name: '',
    email: '',
    password: '',
    username: '',
    confirm: '',
  };

  componentWillMount() {
    if (this.props.isLoggedIn) {
      this.props.push('/')
    }
  }

  componentWillUnmount() {
    this.props.clearSignupErrors();
  }

  handleName = ({target}: SyntheticInputEvent<*>) => {
    const { value } = target;
    this.setState({ name: value });
    checkWhiteSpace(value, this.nameInput);
  }

  handleUsername = ({target}: SyntheticInputEvent<*>) => {
    const { value } = target;
    this.setState({ username: value });
    checkWhiteSpace(value, this.usernameInput);
  }

  handleEmail = ({target}: SyntheticInputEvent<*>) => {
    this.setState({ email: target.value });
  }

  handlePassword = ({target}: SyntheticInputEvent<*>) => {
    this.setState({ password: target.value });
  }

  handleConfirm = ({target}: SyntheticInputEvent<*>) => {
    this.setState({ confirm: target.value });
    confirmPassword(this.state.password, target.value, this.confirmPasswordInput);
  }

  handleSubmit = (e: SyntheticEvent<*>) => {
    e.preventDefault();
    const { name, email, password, username } = this.state;

    const data = {
      name,
      email,
      password,
      username,
    };

    this.props.signup(data)
      .then(() => {
        this.props.push('/books/my');
      });
  }

  get loading() {
    if (!this.props.signupState.isLoading) return null;

    return <Loading />;
  }

  render() {
    const { signupState } = this.props;

    return (
      <div className={s.formWrapper}>
        <Form onSubmit={this.handleSubmit}>
          <div className={s.header}>Signup</div>
          <Error error={signupState.err} />
          {this.loading}
          <Input
           required
           type="text"
           name="name"
           onChange={this.handleName}
           placeholder="Enter your name"
           inputRef={(node) => this.nameInput = node }
          />
          <Input
           required
           type="text"
           name="username"
           onChange={this.handleUsername}
           placeholder="Choose your username"
           inputRef={(node) => this.usernameInput = node }
          />
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
          <Input
           required
           type="password"
           name="password"
           onChange={this.handleConfirm}
           placeholder="Confirm password"
           inputRef={(node) => this.confirmPasswordInput = node}
          />
          <div className={s.redirectLink}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
          <Button
            type="submit"
            text="Signup"
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
    signupState: _.get(state.async, 'signup', {}),
  };
};

export default connect(mapState, {
  signup,
  push,
  clearSignupErrors,
})(Signup);

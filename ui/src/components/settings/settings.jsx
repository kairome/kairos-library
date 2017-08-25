/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { checkWhiteSpace, confirmPassword, confirmNames } from 'utils/validation';

// components
import Input from 'components/input/input';
import Form from 'components/form/form';
import Button from 'components/button/button';
import Error from 'components/error/error';
import Loading from 'components/animations/loading';
import Success from 'components/animations/success';

// actions
import { push } from 'react-router-redux';
import {
  changeName,
  changePassword,
  clearChangeNameErrors,
  clearChangePassErrors,
} from 'actions/user';

// types
import type { AsyncState } from 'types/async';
import type { AuthUser} from 'types/auth';

import s from './settings.css';

type ChangePassword = {
  oldPassword: string,
  newPassword: string,
};

type Props = {
  auth: AuthUser,
  changeNameState: AsyncState,
  changePasswordState: AsyncState,
  push: (path: string) => void,
  changeName: (name: string) => Promise<*>,
  changePassword: (payload: ChangePassword) => Promise<*>,
  clearChangePassErrors: () => void,
  clearChangeNameErrors: () => void,
};

type State = {
  name: string,
  oldPassword: string,
  newPassword: string,
  confirm: string,
  show: boolean,
};

class Settings extends Component<Props, State> {
  newNameInput: ?HTMLElement;
  oldPassInput: ?HTMLElement;
  newPassInput: ?HTMLElement;
  confirmPassInput: ?HTMLElement;

  state = {
    name: this.props.auth.name ? this.props.auth.name : '',
    oldPassword: '',
    newPassword: '',
    confirm: '',
    show: false,
  };

  componentWillMount() {
    const { auth } = this.props;

    if (_.isEmpty(auth) || !auth.isLoggedIn) {
      this.props.push("/login");
    }
  }

  componentDidMount() {
    const { auth } = this.props;
    if (!_.isEmpty(auth) && auth.isLoggedIn) {
      confirmNames(this.state.name, this.props.auth.name, this.newNameInput);
    }
  }

  componentWillUnmount() {
    this.props.clearChangePassErrors();
    this.props.clearChangeNameErrors();
  }

  handleNameChange = ({target}) => {
    const { value } = target;

    this.setState({ name: value });
    confirmNames(value, this.props.auth.name, this.newNameInput);
    checkWhiteSpace(value, this.newNameInput);
  }

  handleNameSubmit = (e) => {
    e.preventDefault();
    this.props.changeName(this.state.name).then(() => {
      this.showSuccess();
      if (this.newNameInput != null) this.newNameInput.blur();
    });
  }

  handleOldPassword = ({target}) => {
    this.setState({ oldPassword: target.value });
  }

  handleNewPassword = ({target}) => {
    this.setState({ newPassword: target.value });
    confirmPassword(target.value, this.state.confirm, this.confirmPassInput);
  }

  handleConfirm = ({target}) => {
    const { value } = target;
    this.setState({ confirm: target.value });
    confirmPassword(this.state.newPassword, value, this.confirmPassInput);
  }

  handlePasswordSubmit = (e) => {
    e.preventDefault();
    const { oldPassword, newPassword } = this.state;
    this.props.changePassword({ oldPassword, newPassword }).then(() => {
      this.setState({ oldPassword: '', newPassword: '', confirm: '' });
      this.showSuccess();
      if (this.oldPassInput != null) this.oldPassInput.blur();
      if (this.newPassInput != null) this.newPassInput.blur();
      if (this.confirmPassInput != null) this.confirmPassInput.blur();
    });
  }

  showSuccess = () => {
    this.setState({ show: true });
    setTimeout(this.hideSuccess, 700);
  }

  hideSuccess = () => {
    this.setState({ show: false });
  }

  get loadingName() {
    if (!this.props.changeNameState.isLoading) return null;

    return <Loading />;
  }

  get loadingPassword() {
    if (!this.props.changePasswordState.isLoading) return null;

    return <Loading />;
  }

  render() {
    const { changePasswordState, changeNameState } = this.props;

    return (
      <div className={s.settings}>
        <Success
          message="Changed!"
          show={this.state.show}
        />
        <div className={s.sectionTitle}>Change your name</div>
        {this.loadingName}
        <Error error={changeNameState.err} />
        <Form onSubmit={this.handleNameSubmit} className={s.formField}>
          <Input
            required
            onChange={this.handleNameChange}
            type="text"
            name="changeName"
            placeholder="Your name"
            defaultValue={this.props.auth.name}
            inputRef={(node) => { this.newNameInput = node }}
          />
          <Button
            type="submit"
            text="Change"
            className={s.changeBtn}
          />
        </Form>

        <div className={`${s.sectionTitle} ${s.passes}`}>Change your password</div>
        {this.loadingPassword}
        <Error error={changePasswordState.err} />
        <Form onSubmit={this.handlePasswordSubmit} className={s.formField}>
          <Input
           required
           type="password"
           name="oldPassword"
           onChange={this.handleOldPassword}
           placeholder="Enter your old password"
           inputRef={(node) => { this.oldPassInput = node }}
           value={this.state.oldPassword}
          />
          <Input
           required
           type="password"
           name="newPassword"
           onChange={this.handleNewPassword}
           placeholder="Enter your new password"
           inputRef={(node) => { this.newPassInput = node }}
           value={this.state.newPassword}
          />
          <Input
           required
           type="password"
           name="confirmNewPassword"
           onChange={this.handleConfirm}
           placeholder="Confirm password"
           inputRef={(node) => { this.confirmPassInput = node }}
           value={this.state.confirm}
          />
          <Button
            type="submit"
            text="Change"
            className={s.changeBtn}
          />
        </Form>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    auth: _.get(state, 'auth', {}),
    changeNameState: _.get(state.async, 'changeName', {}),
    changePasswordState: _.get(state.async, 'changePassword', {}),
  };
};

export default connect(mapState, {
  push,
  changeName,
  changePassword,
  clearChangePassErrors,
  clearChangeNameErrors,
})(Settings);

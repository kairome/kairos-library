/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Link } from 'react-router-dom'
import SideNav from './sidenav';

import { logout } from 'actions/auth';
import { push } from 'react-router-redux';

import s from './header.css';

type Props = {
  isLoggedIn: boolean,
  userName: string,
  logout: () => Promise<*>,
  push: (path: string) => void,
};

type State = {
  showNav: boolean,
};

class Header extends Component<Props, State> {
  state = {
    showNav: false,
  };

  handleLogout = () => {
    this.props.logout().then(() => {
      this.props.push('/');
    });
  }

  get authInfo() {
    if (this.props.isLoggedIn) {
      return (
        <div className={s.authInfo}>
          <div className={s.name}>Hi, <span>{this.props.userName}</span></div>
          <div><Link to="/settings">Settings <i className="fa fa-cog"/></Link></div>
          <Link to="/logout" onClick={this.handleLogout}>Logout <i className="fa fa-sign-out"/></Link>
        </div>
      );
    }

    return (
      <div className={`${s.authInfo} ${s.login}`}>
        <Link to="/login">Login <i className="fa fa-sign-in" /></Link>
      </div>
    );
  }

  get authInfoMobile() {
    if (this.props.isLoggedIn) {
      return (
        <div className={s.authInfo}>
          <div className={s.name}>Hi, <span>{this.props.userName}</span></div>
          <Link className={s.logout} to="/logout" onClick={this.handleLogout}>Logout <i className="fa fa-sign-out"/></Link>
        </div>
      );
    }

    return (
      <div className={`${s.authInfo} ${s.login}`}>
        <Link to="/login">Login <i className="fa fa-sign-in" /></Link>
      </div>
    );
  }

  get protectedRoutes() {
    if (!this.props.isLoggedIn) return null;

    const myBooks = (
      <div className={s.link} key="myBooks">
        <Link to="/books/my">My Books</Link>
       </div>
    );

    const trade = (
      <div className={s.link} key="trade">
        <Link to="/trade">Trade</Link>
      </div>
    );

    return [myBooks, trade];
  }

  get protectedRoutesMobile() {
    if (!this.props.isLoggedIn) return null;

    const myBooks = (
      <div className={s.link} key="myBooksMobile" onClick={this.toggleNav}>
        <Link to="/books/my" onClick={this.toggleNav}>My Books</Link>
       </div>
    );

    const trade = (
      <div className={s.link} key="tradeMobile" onClick={this.toggleNav}>
        <Link to="/trade">Trade</Link>
      </div>
    );

    const settings = (
      <div className={s.link} key="settingsMobile" onClick={this.toggleNav}>
        <Link to="/settings" onClick={this.toggleNav}>Settings</Link>
      </div>
    );
    return [myBooks, trade, settings];
  }

  toggleNav = () => {
    this.setState({ showNav: !this.state.showNav });
  }

  get mobileNav() {
    return (
      <div className={s.mobileNav}>
        <div className={s.hamburgerWrapper}>
          <div className={s.hamburger} onClick={this.toggleNav}>
            <i className="fa fa-minus" />
            <i className="fa fa-minus" />
            <i className="fa fa-minus" />
          </div>
        </div>
        {this.authInfoMobile}
        <SideNav
          show={this.state.showNav}
          toggleNav={this.toggleNav}
          protectedRoutes={this.protectedRoutesMobile}
        />
      </div>
    );
  }

  render() {
    return (
      <div className={s.header}>
        {this.mobileNav}
        <div className={s.navigation}>
          <div className={s.links}>
            <div className={s.link}>
              <Link to="/">Home</Link>
            </div>
            <div className={s.link}>
              <Link to="/books/all">All Books</Link>
            </div>
            {this.protectedRoutes}
          </div>
          {this.authInfo}
        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    isLoggedIn: _.get(state.auth, 'isLoggedIn', false),
    userName: _.get(state.auth, 'name', ''),
  };
};

export default connect(mapState, {
  logout,
  push,
})(Header);

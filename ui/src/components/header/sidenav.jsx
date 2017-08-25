/* @flow */

import React from 'react';

import { Link } from 'react-router-dom';

import type { Node } from 'react';

import s from './header.css';

type Props = {
  show: boolean,
  toggleNav: () => void,
  protectedRoutes: Node,
};

const SideNav = (props: Props) => {
  const { show, toggleNav, protectedRoutes } = props;

  const classes = show ? `${s.sideNav} ${s.show}` : s.sideNav;

  return (
    <div className={classes}>
      <div className={s.closeNav}>
        <i className="fa fa-times" onClick={toggleNav}/>
      </div>
      <div className={s.navLinks}>
        <div className={s.link}>
          <Link to="/" onClick={toggleNav}>Home</Link>
        </div>
        <div className={s.link}>
          <Link to="/books/all" onClick={toggleNav}>All Books</Link>
        </div>
        {protectedRoutes}
      </div>
    </div>
  );
};

export default SideNav;

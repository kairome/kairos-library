/* @flow */

import React from 'react';

import s from './page-404.css';

const Page404 = () => {
  return (
    <div className={s.page}>
      <div className={s.sign}>404</div>
      Oops! Seems like the page you're looking for doesn't exits.
    </div>
  );
};

export default Page404;

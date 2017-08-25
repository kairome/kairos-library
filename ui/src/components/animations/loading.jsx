/* @flow */

import React from 'react';

import s from './loading.css';

const Loading = () => {
  return (
    <div className={s.loadingWrapper}>
      <div className={s.left} />
      <div className={s.middle} />
      <div className={s.right} />
    </div>
  );
};

export default Loading;

/* @flow */

import React from 'react';

import s from './error.css';

type Props = {
  error: ?string,
};

const Error = (props: Props) => {
  if (!props.error) return null;

  return (
    <div className={s.errorWrapper}>
      <span className={s.errorBody}>{props.error}</span>
    </div>
  );
};

export default Error;

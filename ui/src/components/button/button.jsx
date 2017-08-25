/* @flow */

import React, { Component } from 'react';

import s from './button.css';

type Props = {
  className?: string,
  text: string,
};

const Button = (props: Props) => {
  const { text, className, ...rest } = props;
  const classes = className ? `${s.button} ${className}` : s.button;

  return (
    <button
      className={classes}
      {...rest}
    >
      {text}
    </button>
  );
};

export default Button;

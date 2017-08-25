/* @flow */

import React from 'react';

import s from './input.css';

type Props = {
  className?: string,
  inputRef?: (React$ElementRef<*> | null) => mixed,
  type: string,
  required?: boolean,
};

const Input = (props: Props) => {
  const { className, inputRef, ...rest } = props;
  const classes = className ? `${s.input} ${className}` : s.input;

  return (
    <input
      className={classes}
      ref={inputRef ? inputRef : null}
      {...rest}
    />
  );
};

export default Input;

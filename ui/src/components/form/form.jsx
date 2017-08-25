/* @flow */

import React from 'react';

import s from './form.css';

import type { Node } from 'react';

type Props = {
  className?: string,
  children: Node,
  onSubmit: (e: SyntheticEvent<*>) => void,
};

const Form  = (props: Props) => {
  const classes = props.className ? `${s.form} ${props.className}` : s.form;
  return (
    <form
      onSubmit={props.onSubmit}
      className={classes}
    >
      {props.children}
    </form>
  );
};

export default Form;

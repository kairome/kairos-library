/* @flow */

import React from 'react';

import Header from 'components/header/header';

import type { Node } from 'react';

import s from './library.css';

type Props = {
  children: Node,
};

const Library = (props: Props) => {
  return (
    <div className={s.library}>
      <Header />
      <div className={s.content}>
        {props.children}
      </div>
    </div>
  );
};

export default Library;

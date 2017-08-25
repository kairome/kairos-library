/* @flow */

import React from 'react';

import s from './success.css';

type Props = {
  message: string,
  show: boolean,
};

const Success = (props: Props) => {
  const { message, show } = props;
  const text = message ? message : 'Success!';

  const visible = show ? s.show : s.hide;

  return (
    <div className={`${s.actionsWrapper} ${visible}`}>
      <div className={s.text}>{text}</div>
      <div className={s.innerWrapper}>
        <i className="fa fa-check" />
      </div>
    </div>
  );
};

export default Success;

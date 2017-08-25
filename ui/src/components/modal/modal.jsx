/* @flow */

import React from 'react';

import Error from 'components/error/error';

import type { Node } from 'react';

import s from './modal.css';

type Props = {
  show: boolean,
  scroll: boolean,
  toggleModal: () => void,
  err: ?string,
  children: Node,
};

const bodyScrolling = (scroll: boolean) => {
  if (typeof document != 'undefined' && document.body) {
    document.body.classList.toggle('modal', scroll);
  }
};

const Modal = (props: Props) => {
  bodyScrolling(props.scroll);

  if (!props.show) return null;

  return (
    <div className={s.modalWrapper}>
      <div className={s.overlay} onClick={props.toggleModal} />
      <div className={s.modalBody}>
      <div className={s.modalHeader}>
        <div className={s.modalClose}>
          <i className="fa fa-times" onClick={props.toggleModal} />
        </div>
      </div>
      <div className={s.modalContent}>
        <Error error={props.err} />
        {props.children}
      </div>
      </div>
    </div>
  );
};

export default Modal;

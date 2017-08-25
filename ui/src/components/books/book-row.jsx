/* @flow */

import React from 'react';
import _ from 'lodash';

// types
import type { Book } from 'types/books';
import type { TradeBook } from 'types/trade';
import type { Node}  from 'react';
import s from './books.css';

type Props = {
  isLoggedIn?: boolean,
  isLoaned?: boolean,
  isSearch?: boolean,
  toggleBookModal?: (id: string, user: string) => void,

  book: TradeBook | Book,
  initiator?: string,
  status?: string,
  type?: string,
  isTrade: boolean,
  isReceived?: boolean,
  respondLoading?: boolean,
  timer?: Node,
  removeRequest?: (bookId: string, applicant: string, owner: string, initiator: string) => void,
  removeLoading?: boolean,
  respond?: (bookId: string, applicant: string, type: string, initiator: string) => void,
};

const BookRow = (props: Props) => {
  const { book, isTrade } = props;

  const image = () => {
    if (!isTrade) {
      if (props.toggleBookModal) {
        const onBookClick = props.toggleBookModal;
        return (
          <div className={s.image} onClick={() => onBookClick(book.id, book.owner)}>
            <div className={s.cover}/>
            <img className={s.thumbnail} alt={book.title} src={book.image} />
          </div>
        );
      }
    }

    const owner = (<div className={s.requestInfo}>Owner: <span>{book.owner}</span></div>);
    const applicant = (<div className={s.requestInfo}>Applicant: <span>{book.applicant}</span></div>);

    return (
      <div className={`${s.image} ${s.trade}`}>
        <img className={`${s.thumbnail} ${s.trade}`} alt={book.title} src={book.image} />
        {props.isReceived ? applicant : owner}
      </div>
    );
  };

  const getKey = () => {
    if (!isTrade) return '';

    return props.isReceived ? `${book.id} ${book.applicant}` : `${book.id} ${book.owner}`;
  };

  const removeSpinner = () => {
    if(!isTrade) return null;

    if (getKey() != props.initiator || !props.removeLoading) return null;

    return <i className="fa fa-spinner" />;
  };

  const respondSpinner = () => {
    if(!isTrade) return null;

    if (getKey() != props.initiator || !props.respondLoading) return null;
    return <i className="fa fa-spinner" />;
  };

  const action = () => {
    if(!isTrade) return null;

    if (props.status == 'denied' || props.status == 'expired') {
      if (props.removeRequest) {
        const onRemove = props.removeRequest;
        return (
          <div className={s.dismissRequest} onClick={() => onRemove(book.id, book.applicant, book.owner, getKey())}>
            <i className="fa fa-times" /> Remove {removeSpinner()}
          </div>
        );
      }
    }

    if (props.status == 'pending' && props.isReceived) {
      const { type } = props;
      const approving = type == 'approve';

      if (props.respond) {
        const onRepsond = props.respond;
        return (
          <div className={s.tradeActions}>
            <div className={s.approveRequest} onClick={() => onRepsond(book.id, book.applicant, 'approve', getKey()) }>
              <i className="fa fa-thumbs-up" /> Approve {approving ? respondSpinner() : null}
            </div>
            <div className={s.denyRequest} onClick={() => onRepsond(book.id, book.applicant, 'deny', getKey())}>
              <i className="fa fa-thumbs-down" /> Deny {!approving ? respondSpinner() : null}
            </div>
          </div>
        );
      }
    }

    return null;
  }

  return (
    <div className={s.bookRow}>
      <div className={s.bookWrapper}>
        <div className={s.bookInfo}>
          <div className={s.title}>{book.title}</div>
          <div className={s.authors}>by <span>{book.authors}</span></div>
        </div>
        {image()}
        {isTrade ? props.timer : null}
        {action()}
      </div>
    </div>
  );
};

export default BookRow;

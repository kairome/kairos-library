/* @flow */

import React from 'react';

import type { Book } from 'types/books';
import type { Node } from 'react';

import s from './books.css';

type Props = {
  book: Book,
  owner: Node,
  bookAction: Node,
  requestTradeOption: Node,
  timer: Node,
};

const BookModal = (props: Props) => {
  const { book, owner, bookAction, requestTradeOption, timer } = props;
  const categories = book.categories ? book.categories : 'N/A';

  return (
    <div>
      <div>
        <div className={`${s.title} ${s.modal}`}>{book.title}</div>
        <div className={`${s.authors} ${s.modal}`}>by <span>{book.authors}</span></div>
      </div>
      <div className={s.bookDetails}>
        <div className={s.imageAction}>
          <div className={`${s.image} ${s.modal}`}>
            <a href={book.infoLink} target="_blank">
              <img
                className={`${s.thumbnail} ${s.modal}`}
                alt={book.title}
                src={book.image}
              />
            </a>
          </div>
          {bookAction}
          {requestTradeOption}
        </div>
        <div className={s.generalInfo}>
          <div>Published: <span>{book.publishedDate}</span></div>
          <div>Categories: <span>{categories}</span></div>
          {timer}
          {owner}
        </div>
        <div className={s.description} dangerouslySetInnerHTML={{__html: book.description}}></div>
      </div>
    </div>
  );
};

export default BookModal;

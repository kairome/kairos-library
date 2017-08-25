/* @flow */

import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { parseDueTime } from 'utils/book';

// components
import BookRow from './book-row';
import Error from 'components/error/error';
import Modal from 'components/modal/modal';
import BookModal from './book-modal';
import Timer from 'components/timer/timer';

// actions
import {
  addBook,
  removeBook,
  fetchDueTime,
  clearFetchDueTimeErrors,
  toggleBookModal,
  toggleLoanedBookModal,
  closeLoanedBookModal,
  clearAddErrors,
  clearRemoveErrors,
} from 'actions/books';
import { push } from 'react-router-redux';
import { requestTrade, clearRequestTradeErrors } from 'actions/trade';

// types
import type { Book, LoanedBook } from 'types/books';
import type { AsyncState } from 'types/async';
import type { AuthUser } from 'types/auth';

import s from './books.css';

type RequestTrade = {
  bookId: string,
  owner: string,
  applicant: string,
};

type Props = {
  books: Array<Book>,
  loanedBooks: Array<LoanedBook>,
  isAll?: boolean,
  isMy?: boolean,
  isSearch?: boolean,
  isLoaned?: boolean,
  isLoggedIn: boolean,
  showBookModal: boolean,
  showLoanedBookModal: boolean,
  addBookState: AsyncState,
  removeBookState: AsyncState,
  requestState: AsyncState,
  dueTimeState: AsyncState,
  auth: AuthUser,
  fetchBooks: () => Promise<*>,
  showSuccess: (msg: string) => void,
  addBook: (id: string) => Promise<*>,
  removeBook: (id: string) => Promise<*>,
  requestTrade: (payload: RequestTrade) => Promise<*>,
  fetchDueTime: (bookId: string, bookOwner: string) => Promise<*>,
  push: (path: string) => void,
  toggleBookModal: () => void,
  toggleLoanedBookModal: () => void,
  closeLoanedBookModal: () => void,
  clearAddErrors: () => void,
  clearFetchDueTimeErrors: () => void,
  clearRemoveErrors: () => void,
  clearRequestTradeErrors: () => void,
};

type State = {
  currentBook: string,
  currentOwner: string,
};

class Books extends Component<Props, State> {
  state = {
    currentBook: '',
    currentOwner: '',
  };

  componentWillUnmount() {
    this.props.clearFetchDueTimeErrors();
  }
  
  handleAdd = () => {
    const id = this.state.currentBook;

    this.props.addBook(id).then(() => {
      this.props.toggleBookModal();
      this.props.fetchBooks();
      this.props.showSuccess('Added!');
    })
  }

  handleRemove = () => {
    const id = this.state.currentBook;

    this.props.removeBook(id).then(() => {
      this.props.toggleBookModal();
      this.props.fetchBooks();
      this.props.showSuccess('Removed!');
    });
  }

  handleModal = (id, owner) => {
    if (this.props.isMy) {
      this.props.clearAddErrors();
      this.props.clearRemoveErrors();
    }

    if (this.props.isAll) {
      this.props.clearRequestTradeErrors();
    }

    if (this.props.isLoaned) {
      this.props.clearFetchDueTimeErrors();
      this.props.toggleLoanedBookModal();
    } else {
      this.props.toggleBookModal();
    }

    this.setState({ currentBook: id, currentOwner: owner });
  }

  handleRequestTrade = () => {
    if (!this.props.auth.isLoggedIn) {
      this.props.push('/login');
      this.props.toggleBookModal();
      return;
    }

    const { currentBook, currentOwner } = this.state;
    const payload: RequestTrade = {
      bookId: currentBook,
      owner: currentOwner,
      applicant: this.props.auth.username,
    };

    this.props.requestTrade(payload).then(() => {
      this.props.showSuccess('Requested!');
      this.props.toggleBookModal();
    });
  }

  get bookAction() {
    const { isMy, isSearch, removeBookState, addBookState } = this.props;

    const addSpinner = addBookState.isLoading ? <i className="fa fa-spinner" />: null;
    const removeSpinner = removeBookState.isLoading ? <i className="fa fa-spinner" /> : null;

    if (isSearch) {
      return (
        <div className={s.addBtn} onClick={this.handleAdd}>
          <i className="fa fa-plus" /> Add {addSpinner}
        </div>
      );
    }

    if (isMy) {
      return (
        <div className={s.removeBtn} onClick={this.handleRemove}>
          <i className="fa fa-times" /> Remove {removeSpinner}
        </div>
      );
    }

    return null;
  }

  get requestTradeOption() {
    const { isAll, requestState } = this.props;

    if (!isAll) return null;

    const requestSpinner = requestState.isLoading ? <i className="fa fa-spinner" /> : null;

    return (
      <div className={s.requestTrade} onClick={this.handleRequestTrade}>
        <i className="fa fa-exchange"/> Request {requestSpinner}
      </div>
    );
  }

  get timer() {
    if (!this.props.isLoaned) return null;

    return (
      <Timer
        bookId={this.state.currentBook}
        bookOwner={this.state.currentOwner}
        fetch={this.props.fetchBooks}
        closeModal={this.props.closeLoanedBookModal}
        fetchDueTime={this.props.fetchDueTime}
        isLoading={this.props.dueTimeState.isLoading}
      />
    );
  }

  get modalContent() {
    const { currentBook, currentOwner } = this.state;
    const books = this.props.isLoaned ? this.props.loanedBooks : this.props.books;

    const book = _.find(books, { id: currentBook, owner: currentOwner });

    if (!currentBook || _.isEmpty(book)) {
      return (
        <div>
          Sorry, something went wrong.
        </div>
      );
    }

    const { isMy, isLoaned } = this.props;

    const owner = isMy ? null : <div>Owner: <span>{book.owner}</span></div>;
    const action = isLoaned ? null : this.bookAction;
    const trade = isLoaned ? null : this.requestTradeOption;

    return (
      <BookModal
        book={book}
        owner={owner}
        bookAction={action}
        requestTradeOption={trade}
        timer={this.timer}

      />
    );
  }

  sanitizeError = (err) => {
    if (err && err.match('due in')) {
      const splitErr = err.split('in ');
      const dueTime = splitErr[1];
      const parsed = parseDueTime(dueTime);
      const newErr = splitErr[0] + `in ${parsed.hours}h:${parsed.minutes}m:${parsed.seconds}s`;
      return newErr;
    }

    return err;
  }

  get modal() {
    const {
      isAll,
      isLoaned,
      addBookState,
      removeBookState,
      requestState,
      dueTimeState,
      showBookModal,
      showLoanedBookModal,
    } = this.props;

    const err = isAll ? requestState.err : addBookState.err || removeBookState.err
    const fullError = isLoaned ? dueTimeState.err : err;
    const sanitizedError = this.sanitizeError(fullError);

    const toggle = isLoaned ? this.props.toggleLoanedBookModal : this.props.toggleBookModal;
    const show = isLoaned ? showLoanedBookModal : showBookModal;

    return (
      <Modal
        show={show}
        toggleModal={toggle}
        err={sanitizedError}
        scroll={showBookModal || showLoanedBookModal}
      >
        {this.modalContent}
      </Modal>
    );
  }

  get bookRows() {
    const { isSearch, isLoggedIn, isLoaned } = this.props;

    const books = isLoaned ? this.props.loanedBooks : this.props.books;

    return _.map(books, (book) =>  {
      return (
        <BookRow
          key={`${book.id} ${book.owner}`}
          book={book}
          isLoggedIn={isLoggedIn}
          isLoaned={isLoaned}
          isSearch={isSearch}
          toggleBookModal={this.handleModal}
          isTrade={false}
        />
      );
    });
  }

  render() {
    const modal = this.modal;

    return (
      <div className={s.booksWrapper}>
        <div className={s.books}>
          {this.bookRows}
        </div>
        {this.modal}
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    isLoggedIn: _.get(state.auth, 'isLoggedIn', false),
    showBookModal: _.get(state.books, 'showBookModal', false),
    showLoanedBookModal: _.get(state.books, 'showLoanedBookModal', false),
    addBookState: _.get(state.async, 'addBook', {}),
    removeBookState: _.get(state.async, 'removeBook', {}),
    requestState: _.get(state.async, 'requestTrade', {}),
    dueTimeState: _.get(state.async, 'fetchDueTime', {}),
    auth: _.get(state, 'auth', {}),
  };
};

export default connect(mapState, {
  addBook,
  removeBook,
  requestTrade,
  push,
  fetchDueTime,
  toggleBookModal,
  toggleLoanedBookModal,
  closeLoanedBookModal,
  clearAddErrors,
  clearFetchDueTimeErrors,
  clearRemoveErrors,
  clearRequestTradeErrors,
})(Books);

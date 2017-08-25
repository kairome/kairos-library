/* @flow */

import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { filterBooks } from 'utils/book';

// components
import Books from './books';
import SearchBar from 'components/search-bar/search-bar';
import Loading from 'components/animations/loading';
import Error from 'components/error/error';
import Success from 'components/animations/success';

// actions
import { fetchAllBooks, clearFetchAllErrors } from 'actions/books';
import { push } from 'react-router-redux';

// types
import type { AuthUser } from 'types/auth';
import type { Book } from 'types/books';
import type { AsyncState } from 'types/async';

import s from './books.css';

type Props = {
  allBooks: Array<Book>,
  auth: AuthUser,
  fetchState: AsyncState,
  fetchAllBooks: () => Promise<*>,
  clearFetchAllErrors: () => void,
};

type State = {
  searchQuery: string,
  show: boolean,
  msg: string,
};

class AllBooks extends Component<Props, State> {
  state = {
    searchQuery: '',
    show: false,
    msg: '',
  };

  componentWillMount() {
    this.props.fetchAllBooks();
  }

  componentWillUnmount() {
    this.props.clearFetchAllErrors();
  }

  handleSearch = (searchQuery) => {
    this.setState({ searchQuery });
  }

  showSuccess = (msg) => {
    this.setState({ show: true, msg });
    setTimeout(this.hideSuccess, 700);
  }

  hideSuccess = () => {
    this.setState({ show: false });
  }

  get notUsersBooks() {
    const { allBooks, auth  } = this.props;

    if (_.isEmpty(auth)) {
      return allBooks;
    }

    return _.filter(allBooks, (book) => book.owner !== auth.username);
  }

  get books() {
    const books = this.notUsersBooks;

    if (!this.state.searchQuery) return books;

    return filterBooks(books, this.state.searchQuery);
  }

  get content() {
    const allBooks = this.books;
    const { searchQuery } = this.state;

    if (_.isEmpty(allBooks) && !searchQuery) {
      return (
        <div className={s.message}>
          Seems no one has added anything yet
        </div>
      );
    }

    if (_.isEmpty(allBooks) && searchQuery) {
      return (
        <div className={s.message}>
          No results found
        </div>
      );
    }

    return (
      <div className={s.allBooksContent}>
        <Success
          message={this.state.msg}
          show={this.state.show}
        />
        <span className={s.sectionHeader}>All books</span>
        <Books
          books={allBooks}
          fetchBooks={this.props.fetchAllBooks}
          showSuccess={this.showSuccess}
          isAll
        />
      </div>
    );
  }

  get body() {
    const { fetchState } = this.props;

    if (fetchState.err) return <Error error={fetchState.err} />;

    if (fetchState.isLoading) return <Loading />;

    return (
      <div className={s.allBooks}>
        <div className={s.search}>
          <div className={s.searchText}>Need a particular book?</div>
          <SearchBar search={this.handleSearch} />
        </div>
        {this.content}
      </div>
    );
  }

  render() {
    return this.body;
  }
}

const mapState = (state) => {
  return {
    allBooks: _.get(state.books, 'all', []),
    auth: _.get(state, 'auth', {}),
    fetchState: _.get(state.async, 'fetchAllBooks', {}),
  };
};

export default connect(mapState, {
  fetchAllBooks,
  clearFetchAllErrors,
})(AllBooks);

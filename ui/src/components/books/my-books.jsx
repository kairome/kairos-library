/* @flow */

import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { filterBooks } from 'utils/book';

// components
import Books from './books';
import SearchBar from 'components/search-bar/search-bar';
import Success from 'components/animations/success';
import Loading from 'components/animations/loading';
import Error from 'components/error/error';

// actions
import { fetchMyBooks, clearFetchMyErrors } from 'actions/books';
import { search, clearSearchErrors } from 'actions/search';
import { push } from 'react-router-redux';

// types
import type { Book, LoanedBook } from 'types/books';
import type { AsyncState } from 'types/async';

import s from './books.css';

type Props = {
  myBooks: Array<Book>,
  loanedBooks: Array<LoanedBook>,
  searchResults: Array<Book>,
  auth: AsyncState,
  searchState: AsyncState,
  fetchState: AsyncState,
  fetchMyBooks: () => Promise<*>,
  push: (path: string) => void,
  search: (query: string) => Promise<*>,
  clearSearchErrors: () => void,
  clearFetchMyErrors: () => void,
};

type State = {
  isSearching: boolean,
  show: boolean,
  msg: string,
  tab: 'new' | 'my',
  searchQuery: string,
};

class MyBooks extends Component<Props, State> {
  state = {
    isSearching: false,
    show: false,
    msg: '',
    tab: 'new',
    searchQuery: '',
  };

  componentWillMount() {
    const { auth } = this.props;

    if (_.isEmpty(auth) || !auth.isLoggedIn) {
      this.props.push('/login');
    } else {
      this.props.fetchMyBooks();
    }
  }

  componentWillUnmount() {
    this.props.clearFetchMyErrors();
    this.props.clearSearchErrors();
  }

  handleSearch = (query) => {
    if (this.state.tab == 'new') {
      if(!query) {
        this.setState({ isSearching: false });
        this.props.clearSearchErrors();
      } else {
        this.setState({ isSearching: true });
        this.props.search(query);
      }
    }

    this.setState({ searchQuery: query });
  }

  handleSearchTab = (tab) => {
    const { searchQuery } = this.state;

    const shouldSearch = searchQuery != '' && tab == 'new';

    this.setState({ tab, isSearching:  shouldSearch}, () => {
      if (shouldSearch) {
        this.props.search(searchQuery)
        return;
      }

      this.handleSearch(searchQuery);
    });
  }

  showSuccess = (msg) => {
    this.setState({ show: true, msg });
    setTimeout(this.hideSuccess, 700);
  }

  hideSuccess = () => {
    this.setState({ show: false });
  }

  get books() {
    if (this.state.isSearching) {
      return this.props.searchResults;
    }

    const { searchQuery } = this.state;
    const { myBooks } = this.props;

    if (searchQuery == '') return myBooks;

    return filterBooks(myBooks, searchQuery);
  }

  get loanedBooks() {
    const { loanedBooks } = this.props;
    const { isSearching, searchQuery } = this.state;

    if (_.isEmpty(loanedBooks) || isSearching) return null;

    const books = searchQuery == '' ? loanedBooks : filterBooks(loanedBooks, searchQuery);

    return (
      <div>
        <span className={s.sectionHeader}>Loaned books</span>
        <Books
          loanedBooks={books}
          fetchBooks={this.props.fetchMyBooks}
          isLoaned
        />
      </div>
    );
  }

  get content() {
    const { isSearching } = this.state;
    const myBooks = isSearching ? this.props.searchResults : this.props.myBooks;
    const { searchState } = this.props;

    if (searchState.err) return <Error error={searchState.err} />;

    if (searchState.isLoading) {
      return <Loading />;
    }

    if (isSearching && _.isEmpty(myBooks)) {
      return (
        <div className={s.message}>
          No results found
        </div>
      );
    }

    if (!isSearching && _.isEmpty(myBooks)) {
      return (
        <div>
          {this.loanedBooks}
          <div className={s.message}>
            Seems you haven't added anything yet
          </div>
        </div>
      );
    }

    const title = isSearching ? 'Books found' : 'My books';
    return (
      <div>
        {this.loanedBooks}
        <span className={s.sectionHeader}>{title}</span>
        <Books
          books={this.books}
          fetchBooks={this.props.fetchMyBooks}
          isMy
          isSearch={this.state.isSearching}
          showSuccess={this.showSuccess}
        />
      </div>
    );
  }

  get body() {
    const { fetchState } = this.props;

    if (fetchState.err) return <Error error={fetchState.err} />;

    if (fetchState.isLoading && !this.state.isSearching) return <Loading />;

    const tabChosen = this.state.tab == 'new';

    const newTabClass = tabChosen ? `${s.searchTab} ${s.chosen}` : s.searchTab;
    const myTabClass = !tabChosen ? `${s.searchTab} ${s.chosen}` : s.searchTab;

    return (
      <div className={s.myBooks}>
        <Success
          message={this.state.msg}
          show={this.state.show}
        />
        <div className={s.search}>
          <div className={s.searchTabs}>
            <i className="fa fa-search"/>
            <div className={newTabClass} onClick={() => this.handleSearchTab('new')}>
              New book
            </div>
            <div className={myTabClass} onClick={() => this.handleSearchTab('my')}>
              My books
            </div>
          </div>
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
    myBooks: _.get(state.books, ['my', 'books'], []),
    loanedBooks: _.get(state.books, ['my', 'loaned'], []),
    searchResults: _.get(state.search, 'results', []),
    auth: _.get(state, 'auth', {}),
    searchState: _.get(state.async, 'search', {}),
    fetchState: _.get(state.async, 'fetchMyBooks', {}),
  };
};

export default connect(mapState, {
  fetchMyBooks,
  push,
  search,
  clearSearchErrors,
  clearFetchMyErrors,
})(MyBooks);

/* @flow */

import React, { Component } from 'react';

import Button from 'components/button/button';
import Input from 'components/input/input';

import s from './search-bar.css';

type Props = {
  search: (value: string) => void,
};

type State = {
  value: string,
};

let timeOut;

class SearchBar extends Component<Props, State> {
  state = {
    value: '',
  };

  handleChange = ({target}: SyntheticInputEvent<*>) => {
    this.setState({ value: target.value });
    clearTimeout(timeOut);
    timeOut = setTimeout(this.handleClick, 1000);
  }

  handleKeyPress = ({keyCode}: SyntheticKeyboardEvent<*>) => {
    if (keyCode == 13) {
      clearTimeout(timeOut);
      this.handleClick();
    }
  }

  handleClick = () => {
    this.props.search(this.state.value);
  }

  handleClear = () => {
    this.setState({ value: ''});
    this.props.search('');
  }

  render() {
    return (
      <div className={s.searchBar}>
        <Input
          type="text"
          name="search"
          value={this.state.value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyPress}
          placeholder="Search here"
        />
        <Button
          text="Clear"
          onClick={this.handleClear}
          className={s.clearButton}
        />
      </div>
    );
  }
}

export default SearchBar;

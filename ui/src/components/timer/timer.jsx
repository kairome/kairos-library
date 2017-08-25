/* @flow */

import React, { Component } from 'react';
import _ from 'lodash';
import { parseDueTime } from 'utils/book';

import type { Node } from 'react';

import s from './timer.css';

type Props = {
  bookId: string,
  bookOwner: string,
  isLoading: boolean,
  isTrade?: boolean,
  fetch: () => Promise<*>,
  fetchDueTime: (bookId: string, bookOwner: string) => Promise<*>,
  closeModal?: () => void,
};

type State = {
  hours: number,
  hours: number,
  minutes: number,
  seconds: number,
  interval: number,
  fetched: boolean,
};

class Timer extends Component<Props, State> {
  state = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    interval: 0,
    fetched: false,
  };

  componentDidMount() {
    this.props.fetchDueTime(this.props.bookId, this.props.bookOwner).then((resp) => {
      if (this.props.isLoading) return;

      const timeLeft = parseDueTime(resp.due);

      this.setState({
        ...timeLeft,
        fetched: true,
      });

      this.state.interval = setInterval(this.deductTime, 1000);
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  deductTime = () => {
    const { hours, minutes, seconds } = this.state;
    const t = (hours * 3600 + minutes*60 + seconds) - 1;
    if (t < 0 ) {
      clearInterval(this.state.interval);
      setTimeout(() => {
        this.finish();
      }, 200);
      return;
    }

    this.setState({
      hours: parseInt(t/3600),
      minutes: parseInt(t%3600/60),
      seconds: parseInt(t%3600%60),
    });
  }

  finish = () => {
    this.props.fetch();
    if (!this.props.isTrade && this.props.closeModal) {
      this.props.closeModal();
    }
  }

  get content(): Node {
    const { isLoading, isTrade } = this.props;

    if (isLoading || !this.state.fetched) {
      return (
        <div className={s.loading}>
          <i className="fa fa-spinner" />
        </div>
      );
    }

    const { hours, minutes, seconds } = this.state;
    const time = `${hours}h:${minutes}m:${seconds}s`;

    const classes = isTrade ? s.container : null;
    return (
      <div className={classes}>Due in: <span>{time}</span></div>
    );
  }

  render() {
    return this.content
  }
};

export default Timer;

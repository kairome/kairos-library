/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// components
import { Link } from 'react-router-dom';
import Requests from './requests';
import Loading from 'components/animations/loading';
import Error from 'components/error/error';
import Success from 'components/animations/success';

// actions
import {
  fetchMyRequests,
  fetchReceivedRequests,
  removeTradeRequest,
  respondToRequest,
  removeRequestsInBulk,
  clearRemoveBulkError,
  clearRemoveRequestErrors,
  clearRespondErrors,
  clearMyRequestsErrors,
  clearReceivedRequestsErrors,
} from 'actions/trade';
import { fetchDueTime, clearFetchDueTimeErrors } from 'actions/books';
import { push } from 'react-router-redux';

// types
import type { RequestsType, RemoveRequest, RequestAction } from 'types/trade';
import type { AsyncState } from 'types/async';

import s from './trade.css';

type Props = {
  myRequests: RequestsType,
  receivedRequests: RequestsType,
  isLoggedIn: boolean,
  myRequestsState: AsyncState,
  removeRequestState: AsyncState,
  receivedRequestsState: AsyncState,
  respondState: AsyncState,
  dueTimeState: AsyncState,
  removeBulkState:AsyncState,
  fetchMyRequests: () => Promise<*>,
  fetchReceivedRequests: () => Promise<*>,
  fetchDueTime: (bookId: string, bookOwner: string) => Promise<*>,
  removeTradeRequest: (payload: RemoveRequest) => Promise<*>,
  removeRequestsInBulk: (option: 'my' | 'received', status: string) => Promise<*>,
  respondToRequest: (payload: RequestAction) => Promise<*>,
  push: (path: string) => void,
  clearRemoveRequestErrors: () => void,
  clearFetchDueTimeErrors: () => void,
  clearRespondErrors: () => void,
  clearMyRequestsErrors: () => void,
  clearReceivedRequestsErrors: () => void,
  clearRemoveBulkError: () => void,
};

type State = {
  option: 'my' | 'received',
  tab: 'pending' | 'approved' | 'denied' | 'expired',
  successMsg: string,
  showSuccess: boolean,
};

export type RequestsCmpProps = {
  requests: RequestsType,
  err: ?string,
  status: $PropertyType<State, 'tab'>,
  option: $PropertyType<State, 'option'>,
  dueTimeLoading: boolean,
  removeRequestLoading: boolean,
  removeBulkLoading: boolean,
  respondLoading?: boolean,
  isReceived?: boolean,
  changeTab: (tab: $PropertyType<State, 'tab'>) => void,
  remove: $PropertyType<Props, 'removeTradeRequest'>,
  fetchDueTime: $PropertyType<Props, 'fetchDueTime'>,
  showSuccess: (msg: string) => void,
  removeInBulk: $PropertyType<Props, 'removeRequestsInBulk'>,
  fetch: () => Promise<*>,
  respond?: $PropertyType<Props, 'respondToRequest'>,
};

class Trade extends Component<Props, State> {
  state = {
    option: 'my',
    tab: 'pending',
    successMsg: '',
    showSuccess: false,
  };

  componentWillMount() {
    if (!this.props.isLoggedIn) {
      this.props.push('/login');
    } else {
      this.props.fetchMyRequests();
    }
  }

  changeOption = (option) => {
    this.setState({ option });
    if (option == 'my') {
      this.props.fetchMyRequests();
    } else {
      this.props.fetchReceivedRequests();
    }

    this.props.clearReceivedRequestsErrors();
    this.props.clearMyRequestsErrors();
    this.props.clearRemoveRequestErrors();
    this.props.clearRemoveBulkError();
    this.props.clearFetchDueTimeErrors();
  }

  changeTab = (tab) => {
    this.props.clearFetchDueTimeErrors();
    this.props.clearRemoveRequestErrors();
    this.props.clearRemoveBulkError();

    if (this.state.option == 'received') {
      this.props.clearRespondErrors();
    }

    this.setState({ tab });
  }

  showSuccess = (msg) => {
    this.setState({ showSuccess: true, successMsg: msg });
    setTimeout(this.hideSuccess, 700);
  }

  hideSuccess = () => {
    this.setState({ showSuccess: false });
  }

  get content() {
    const { option } = this.state;
    const {
      myRequestsState,
      receivedRequestsState,
      dueTimeState,
      removeRequestState,
      respondState,
      removeBulkState,
      myRequests,
      fetchMyRequests,
      receivedRequests,
      fetchReceivedRequests,
    } = this.props;

    const loading = myRequestsState.isLoading || receivedRequestsState.isLoading;
    const err = myRequestsState.err || receivedRequestsState.err;

    if (err) return <Error error={err} />;

    if (loading) return <Loading />;

    const props: RequestsCmpProps = {
      remove: this.props.removeTradeRequest,
      err: removeRequestState.err || dueTimeState.err || removeBulkState.err,
      changeTab: this.changeTab,
      status: this.state.tab,
      option: this.state.option,
      dueTimeLoading: dueTimeState.isLoading,
      fetchDueTime: this.props.fetchDueTime,
      removeRequestLoading: removeRequestState.isLoading,
      removeBulkLoading: removeBulkState.isLoading,
      showSuccess: this.showSuccess,
      removeInBulk: this.props.removeRequestsInBulk,
      requests: option == 'my' ? myRequests : receivedRequests,
      fetch: option == 'my' ? fetchMyRequests : fetchReceivedRequests,
    };

    if (option == 'received') {
      props.isReceived = true;
      props.respond = this.props.respondToRequest;
      props.respondLoading = respondState.isLoading;
      props.err = props.err || respondState.err;
    }

    return (
      <Requests
        {...props}
      />
    );
  }

  get body() {
    const { option } = this.state;

    const optionTab = option == 'my';

    const myClasses = optionTab ? `${s.tradeOption} ${s.chosen}` : s.tradeOption;
    const receivedClasses = !optionTab ? `${s.tradeOption} ${s.chosen}` : s.tradeOption;

    return (
      <div>
        <Success
          message={this.state.successMsg}
          show={this.state.showSuccess}
        />
        <div className={s.tradeWrapper}>
          <div
            className={myClasses}
            onClick={() => { this.changeOption('my') }}
          >
            My requests
          </div>
          <div
            className={receivedClasses}
            onClick={() => { this.changeOption('received') }}
          >
            Received requests
          </div>
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
    myRequests: _.get(state.trade, 'my', {}),
    receivedRequests: _.get(state.trade, 'received', {}),
    isLoggedIn: _.get(state.auth, 'isLoggedIn', false),
    myRequestsState: _.get(state.async, 'fetchMyRequests', {}),
    removeRequestState: _.get(state.async, 'removeTradeRequest', {}),
    receivedRequestsState: _.get(state.async, 'fetchReceivedRequests', {}),
    respondState: _.get(state.async, 'respondToRequest', {}),
    dueTimeState: _.get(state.async, 'fetchDueTime', {}),
    removeBulkState: _.get(state.async, 'removeRequestsInBulk', {}),
  };
};

export default connect(mapState, {
  fetchMyRequests,
  fetchReceivedRequests,
  fetchDueTime,
  removeTradeRequest,
  removeRequestsInBulk,
  respondToRequest,
  clearRemoveRequestErrors,
  clearFetchDueTimeErrors,
  clearRespondErrors,
  clearMyRequestsErrors,
  clearReceivedRequestsErrors,
  clearRemoveBulkError,
  push,
})(Trade);

/* @flow */

import React, { Component } from 'react';
import _ from 'lodash';

// components
import BookRow from 'components/books/book-row';
import Error from 'components/error/error';
import Timer from 'components/timer/timer';
import Button from 'components/button/button';

// types
import type { RequestsType } from 'types/trade';
import type { RequestsCmpProps } from './trade';
import type { Node } from 'react';

import s from './trade.css';

type State = {
  respondType: string,
  initiator: string,
  showConfirm: boolean,
};

class Requests extends Component<RequestsCmpProps, State> {
  state = {
    respondType: '',
    initiator: '',
    showConfirm: false,
  };

  handleRemoveRequest = (bookId: string, applicant: string, owner: string, initiator: string) => {
    const type = this.props.option;
    this.setState({ initiator });
    this.props.remove({ bookId, applicant, type, owner }).then(() => {
      this.props.showSuccess('Removed!');
      this.props.fetch();
    });
  }

  handleRespond = (bookId: string, applicant: string, type: string, initiator: string) => {
    this.setState({ respondType: type, initiator });
    if (this.props.respond) {
      this.props.respond({ bookId, applicant, type }).then(() => {
        const msg = type == 'approve' ? 'Approved!' : 'Denied!';
        this.props.showSuccess(msg);
        this.props.fetch();
      });
    }
  }

  handleRemoveBulk = (confirm: boolean) => {
    if (!confirm) {
      this.setState({ showConfirm: false });
      return;
    }

    this.props.removeInBulk(this.props.option, this.props.status).then(() => {
      this.setState({ showConfirm: false });
      this.props.fetch();
      this.props.showSuccess('Removed!');
    })
  }

  toggleConfirmation = () => {
    this.setState((prevState, props) => {
      return {
        showConfirm: !prevState.showConfirm,
      };
    });
  }

  getTimer = (bookId: string, bookOwner: string): Node => {
    if (this.props.status != 'approved') return null;

    return (
      <Timer
        bookId={bookId}
        fetch={this.props.fetch}
        fetchDueTime={this.props.fetchDueTime}
        isLoading={this.props.dueTimeLoading}
        bookOwner={bookOwner}
        isTrade
      />
    );
  }

  getRequests = (requests: RequestsType): Node => {
    if (_.isEmpty(requests)) return (
      <div className={s.message}>
        Nothing found
      </div>
    );

    const { isReceived } = this.props;

    const chosenRequests =  _.map(requests, (request) => {
      const key = isReceived ? `${request.id} ${request.applicant}` : `${request.id} ${request.owner}`;

      return (
        <BookRow
          isTrade
          book={request}
          key={key}
          initiator={this.state.initiator}
          isReceived={isReceived}
          status={this.props.status}
          removeRequest={this.handleRemoveRequest}
          removeLoading={this.props.removeRequestLoading}
          respond={this.handleRespond}
          respondLoading={this.props.respondLoading}
          type={this.state.respondType}
          timer={this.getTimer(request.id, request.owner)}
        />
      );
    });

    return (
      <div className={s.requests}>
        {chosenRequests}
      </div>
    );
  }

  get content(): Node {
    const { requests, status } = this.props;

    return this.getRequests(requests[status]);
  }

  get tabs(): Node {
    const tabs = ['pending', 'approved', 'denied', 'expired'];
    const { requests, status } = this.props;

    return _.map(tabs, (tab) => {
      const num = requests[tab] ? requests[tab].length : 0;

      const tabChosen = tab == status;
      const tabClass = tabChosen ? `${s.tab} ${s.chosen}` : s.tab;

      return (
        <div
          className={tabClass}
          onClick={() => { this.props.changeTab(tab) }}
          key={tab}
        >
          {_.capitalize(tab)} <i className={s.num}>{num}</i>
        </div>
      );
    });
  }

  get confirmation(): Node {
    const { showConfirm } = this.state;

    if (!showConfirm) return null;

    return (
      <div className={s.confirmation}>
        Are you sure you want to remove <b>ALL</b> {this.props.status} requests?
        <div className={s.confirmationBtns}>
          <Button
            text="Yes"
            className={s.confirmationBtn}
            onClick={() => { this.handleRemoveBulk(true) } }
          />
          <Button
            text="No"
            className={s.confirmationBtn}
            onClick={() => { this.handleRemoveBulk(false) } }
          />
        </div>
      </div>
    );
  }

  get bulkRemoval(): Node {
    const { status, requests } = this.props;

    if (status != 'denied' && status != 'expired') {
      return null;
    }

    if (_.isEmpty(requests[status])) return null;

    const { removeBulkLoading } = this.props;

    const { showConfirm } = this.state;
    const btnClass = showConfirm ? `${s.removeBtn} ${s.confirming}` : s.removeBtn;
    const spinner = removeBulkLoading ? <i className="fa fa-spinner" /> : null;

    return (
      <div className={s.removeAll}>
        <div className={btnClass} onClick={this.toggleConfirmation}>
          <i className="fa fa-times" /> Remove all {spinner}
        </div>
        {this.confirmation}
      </div>
    );
  }

  render() {
    const { err } = this.props;

    return (
      <div>
        <div className={s.tabs}>
          {this.tabs}
        </div>
        <div>
          <Error error={err} />
          {this.bulkRemoval}
          {this.content}
        </div>
      </div>
    );
  }
}

export default Requests;

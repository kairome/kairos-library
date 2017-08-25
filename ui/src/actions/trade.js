/* @flow */

import { createAsyncAction } from './async-actions';
import { createReducer, createAction } from 'redux-act';
import { makeRequest } from './request';

type RequestTrade = {
  bookId: string,
  owner: string,
  applicant: string,
};

type RespondToRequest = {
  bookId: string,
  applicant: string,
  type: 'approve' | 'deny',
};

type RemoveRequest = {
  bookId: string,
  applicant: string,
  owner: string,
  type: 'my' | 'received',
};

export const clearTrade = createAction('CLEAR_TRADE');

const _requestTrade = createAsyncAction(
  'REQUEST_TRADE',
  function(payload: RequestTrade) {
    return makeRequest('POST', '/api/trade/request', payload);
  }
);
export const requestTrade = _requestTrade.perform;
export const clearRequestTradeErrors = _requestTrade.clearError;

const _fetchMyRequests = createAsyncAction(
  'FETCH_MY_REQUESTS',
  function() {
    return makeRequest('GET', '/api/trade/my').then(response => response.body);
  }
);
export const fetchMyRequests = _fetchMyRequests.perform;
export const clearMyRequestsErrors = _fetchMyRequests.clearError;

const _fetchReceivedRequests = createAsyncAction(
  'FETCH_RECEIVED_REQUESTS',
  function() {
    return makeRequest('GET', '/api/trade/received').then(response => response.body);
  }
);
export const fetchReceivedRequests = _fetchReceivedRequests.perform;
export const clearReceivedRequestsErrors = _fetchReceivedRequests.clearError;

const _removeTradeRequest = createAsyncAction(
  'REMOVE_TRADE_REQUEST',
  function(payload: RemoveRequest) {
    return makeRequest('DELETE', '/api/trade/request', payload);
  }
);
export const removeTradeRequest = _removeTradeRequest.perform;
export const clearRemoveRequestErrors = _removeTradeRequest.clearError;

const _respondToRequest = createAsyncAction(
  'RESPOND_TO_TRADE_REQUEST',
  function(payload: RespondToRequest) {
    return makeRequest('PATCH', '/api/trade/request', payload);
  }
);

export const respondToRequest = _respondToRequest.perform;
export const clearRespondErrors = _respondToRequest.clearError;

export const _removeRequestsInBulk = createAsyncAction(
  'REMOVE_REQUESTS_IN_BULK',
  function(type: string, status: string) {
    return makeRequest('DELETE', `/api/trade/requests/${type}/${status}`);
  }
);

export const removeRequestsInBulk = _removeRequestsInBulk.perform;
export const clearRemoveBulkError = _removeRequestsInBulk.clearError;

export const tradeAsync = {
  requestTrade: _requestTrade,
  fetchMyRequests: _fetchMyRequests,
  fetchReceivedRequests: _fetchReceivedRequests,
  removeTradeRequest: _removeTradeRequest,
  respondToRequest: _respondToRequest,
  removeRequestsInBulk: _removeRequestsInBulk,
};

const initialState = {
  my: {},
  received: {},
};

const reducer = createReducer({
  [_fetchMyRequests.success]: (state, my) => ({
    ...state,
    my,
  }),
  [_fetchReceivedRequests.success]: (state, received) => ({
    ...state,
    received,
  }),
  [clearTrade]: () => ({
    ...initialState,
  }),
}, initialState);

export default reducer;

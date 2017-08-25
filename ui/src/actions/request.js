/* @flow */

import request from 'superagent';

const api = process.env.API_URL ? process.env.API_URL : 'http://localhost:8080';

export const makeRequest = (requestType: string, url: string, data?: Object) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  // get the API URL
  const newUrl = `${api}${url}`;

  const currentRequest = request(requestType, newUrl).set(headers).withCredentials();

  if (requestType === 'GET') {
    currentRequest.query(data);
  } else {
    currentRequest.send(data);
  }

  return currentRequest.catch((err) => {
    const { body, type } = err.response;

    if (!body && type === 'text/plain') {
      throw err.response.text;
    } else if (body && type === 'application/json') {
      throw body;
    }
  });
};

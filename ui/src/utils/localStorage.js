/* @flow */

import _ from 'lodash';

export const saveToStorage = (data: Object) => {
  if (typeof window != 'undefined') {
    const keys = Object.keys(data);
    _.forEach(keys, (key) => {
      window.localStorage.setItem(key, data[key]);
    });
  }
};

export const removeFromStorage = (items: Array<string>) => {
  if (typeof window != 'undefined') {
    _.forEach(items, (item) => {
      window.localStorage.removeItem(item);
    });
  }
};

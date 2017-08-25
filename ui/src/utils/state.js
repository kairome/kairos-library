/* @flow */

export const getInitialState = () => {
  if (typeof window != 'undefined') {
    const l = window.localStorage.getItem('isLoggedIn');
    const isLoggedIn = l === 'true';

    if (isLoggedIn) {
      const name = window.localStorage.getItem('name');
      const username = window.localStorage.getItem('username');
      return {
        auth: {
          name,
          username,
          isLoggedIn,
        },
      };
    }
  }

  return {
    auth: {},
  };
};

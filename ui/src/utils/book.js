/* @flow */

import _ from 'lodash';

export const parseDueTime = (due: string) => {
  const emptyTime = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (!due) return emptyTime;

  const hours = due.split('h');

  if (!hours[1]) {
    hours.unshift('0');
  }

  const minutes = hours[1].split('m');

  if (!minutes[1]) {
    minutes.unshift('0');
  }

  const seconds = minutes[1].split('s');

  const parsedHours = parseInt(hours[0], 10);
  const parsedMinutes = parseInt(minutes[0], 10);
  const parsedSeconds = parseInt(seconds[0], 10);

  if (isNaN(parsedHours) || isNaN(parsedMinutes) || isNaN(parsedSeconds)) return emptyTime;

  return {
    hours: parsedHours,
    minutes: parsedMinutes,
    seconds: parsedSeconds,
  };
};

export const filterBooks = (books: Array<Object>, query: string) => _.filter(books, (book) => {
  const q = query.toLowerCase();
  const title = book.title.toLowerCase();
  const authors = book.authors.toLowerCase();
  const owner = book.owner.toLowerCase();

  const t = title.indexOf(q);
  const a = authors.indexOf(q);
  const o = owner.indexOf(q);
  return t !== -1 || a !== -1 || o !== -1;
});

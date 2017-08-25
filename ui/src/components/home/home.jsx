/* @flow */

import React from 'react';

import { Link } from 'react-router-dom';

import s from './home.css';

const Home = () => {
  return (
    <div className={s.page}>
      <h1>Welcome to the Library of Kairos!</h1>
      <p>
        This app is intended to function like a book shelf/trading club.
        You can add books to your collection and view the books of others.
      </p>
      <p>
        In addition, every book belonging to other users can be requested for a loan.
        All requests are managed on <Link to="/trade">Trade</Link> page, where you'll see your book requests as well as the ones sent to you.
      </p>
      <p>
        Once the book request has been approved,
        you'll see it appear in <Link to="/books/my">My Books</Link> under the <em>Loaned</em> section.
        But be snappy about it, you've got only <em>10 minutes</em> before the book returns to its original owner!
      </p>
        The app is meant to showcase the skill of the developer
        (<a href="https://github.com/kairome" target="_blank">me</a>),
        rather than being a full fledged production app, thus you have a limit of 10 minutes per loan, and the books are not directly uploaded from you, but are coming from <a href="https://developers.google.com/books/" target="_blank">Google Books API</a>.
      <p>
        Hope you enjoy it! Have a nice day!
      </p>
    </div>
  );
}

export default Home;

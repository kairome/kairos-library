# The Library of Kairos

If you want to try it out, you can sign up with any fake email, or simply use `guest@example.com/guest`
 
**Online [demo](http://kairome.com)**


## Concept

The app is a hybrid between a bookshelf and a trading club. You can add/remove books as well as trade them.
Seeing as the app is a showcase app and by no means a production ready one, instead of uploading the actual files to the server, the books are taken from [Google API](https://developers.google.com/books/).

In **All books** section you can see all the books added to the collection except for your own.
On **My books** page you can search for new books to add, or you can search for books in your collection.
Once you requested a book (on **All books** page you have to click on the book, the modal will open up, and you'll see a *Request* button under the book's cover), the request will appear on **Trade** page under *My requests* tab.
Here you can manage all incoming and outgoing requests.

If the book has been approved, it will appear under *Approved* tab along with the timer for 10 minutes. After 10 minutes run out, the book will be automatically removed from your collection.
You can view the loaned book on **My books** page under *Loaned* section.

## Stack

The app uses [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/
) for front-end built with the help of [webpack](https://webpack.github.io/).
For preprocessor [PostCSS](https://github.com/postcss/postcss) was used.

The back-end part consists of [node.js](https://nodejs.org/en/) and [golang](https://golang.org/).
Node.js is used for serving static assets, proxying the API requests and for React server-side rendering.
Golang is used for the main API.

[PostgreSQL](https://www.postgresql.org/) is the data base of choice.

Everything is deployed on [Google Cloud](https://cloud.google.com/).

## Structure

The **ui** folder has all the front-end part as well as the node.js server.
The **server** folder holds the main golang API.
The **expire** folder has the golang utility for expiring books.

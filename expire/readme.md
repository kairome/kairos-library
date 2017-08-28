## Expire utility

That's where you can find the utility that expires books.

## Launch

It is assumed that you launched the API prior to launching the utility.

The difference between production and development is the same here as with the API server.

1. Create and populate `.env` file with the *DB_** variables, similar to the API
2. In case for some reason you don't have the dependencies installed, you can do `make prepare`.
3. If everything is in place, type `make launch`.
4. You should see the time stamp with the message **Expire util started.**.

## API

This is where the main API lives. The folders' names are pretty self-explanatory here.

## Launch

There is a small difference between production and development here. The production version will simply launch the app with `nohup` and send the output to `log/` folder.

To set things up,

1. Make sure you have golang and PostgreSQL installed.
2. After that, you will have to configure PostgreSQL database (create a user/password and db itself).
3. Create `.env` file out of `.env.local` and populate the *DB_** variables.
4. Then, run `sh create_keys.sh` to create RSA keys for JWT.
5. Populate the *RSA_** variables in `.env`.
6. If it's your first time, run `make prepare`. That will install all the dependencies in *../go_pkgs* folder. Or you can run `go get -d` if you have your *GOPATH* variable set up.
7. Then for development, run `make launch`.
8. API should be listening on port 8000 by default.

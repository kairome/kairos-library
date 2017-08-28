## Front-end

This is where all front-end code lies.

Node.js code can be found in *server* folder, React/Redux in *src*.

## Launch

### Development

1. Make sure yarn/nodejs is already installed. If not, run `sh dependencies.sh`.
2. If it's your first time, run `make install`.
3. Make sure that you created `.env` file and placed/populated the variables found in `.env.local`.
4. `EXTERNAL_SERVER=TRUE` and `API_URL=http://localhost:8000` if you launched the API with default settings.
5. Then simply `make dev` and the app should be listening on port 3000.

### Production

1. Steps **3 and 4** from *Development* section above.
3. For the first run, launch `make build`. For later runs you can simply type `make prod`.
4. The app should be listening on port 3000 again. You can change that by setting `PORT=(your port)` in `.env`.

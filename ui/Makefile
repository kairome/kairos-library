DEV_PORT = 4001

export PATH := $(PWD)/node_modules/.bin:$(PATH)

clean-build:
	rm -rf build/
	rm -rf lib/

clean: clean-build
	rm -rf node_modules/

install: clean
	yarn cache clean
	yarn --pure-lockfile

nodemon:
	DEV_PORT=$(DEV_PORT)	nodemon --watch server --watch .env \
	--exec "node -r dotenv/config" ./server/index.js

build-dev:
	NODE_ENV=development webpack-dev-server \
	--inline --watch --hot --progress --content-base=build --history-api-fallback --port $(DEV_PORT)

dev:
	 make -j build-dev nodemon

build-prod: clean-build
	NODE_ENV=production webpack --progress

build-server:
	webpack --config server.config.js -p  --progress

prod: build-prod build-server
	NODE_ENV=production nohup node ./server/index.js &

build: install prod

check:
	yarn lint
	yarn flow

.PHONY: clean-build clean install nodemon build-dev dev build-prod build-server prod build

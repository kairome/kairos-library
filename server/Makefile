GOPATH=$(PWD)/../go_pkgs

LOG_PATH=$(PWD)/../log/server.log

prepare:
	rm -rf build/
	go get -d

build:
	go build -o build/server

launch: build
	test -f .env && export eval `cat .env` || true && ./build/server

prod: prepare build
	test -f .env && export eval `cat .env` || true && ./build/server 2>&1 | tee -a $(LOG_PATH)

.PHONY: prepare build launch prod

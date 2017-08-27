GOPATH=$(PWD)/../go_pkgs

LOG_PATH=$(PWD)/../log/expire.log

prepare:
	rm -rf build/
	go get -d

build:
	go build -o build/expire

launch: build
	test -f .env && export eval `cat .env` || true && ./build/expire

prod: prepare build
	test -f .env && export eval `cat .env` || true && nohup ./build/expire > $(LOG_PATH) &

.PHONY: prepare build launch prod

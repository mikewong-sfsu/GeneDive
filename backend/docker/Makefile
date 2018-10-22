.PHONY: all

all: build run

build:
	@echo Cloning the GeneDive application for Docker installation
	cp -Rf ../../frontend .
	cp -Rf ../../backend/data data
	cp -Rf ../../backend/preprocessing preprocessing
	docker build -t genedive .
	@echo Cleaning up GeneDive application cache
	rm -Rf frontend data preprocessing

run:
	docker run -d -p 8080:80 --name genedive-local genedive

stop:
	docker stop genedive-local

clean: 
	rm -Rf frontend data preprocessing
	docker rm genedive-local


.PHONY: all build cache clean devel run shell stop

-include port.make
# File 'port.make' should contain the following line only (uncommented)
#
# PORT=<Your port number>
#

# Create a file 'port.make' replacing the variable below if you want another
# port; don't change this variable. Alternatively, define the variable prior
# to running make on the command line, i.e.
#
# $ PORT=<Your port number> make
#
PORT?=8080

all: devel build run

build: cache
	@echo Building Docker container
	docker build -t genedive .
	@echo Cleaning up GeneDive application cache
	rm -Rf devel

cache:
	@echo Cloning the GeneDive application for Docker installation
	cp -Rf ../../.git devel
	cp -Rf ../../.gitignore devel
	cp -Rf ../../LICENSE devel
	cp -Rf ../../frontend devel
	cp -Rf ../../backend/docker.compose devel/backend
	cp -Rf ../../backend/docker/install devel/backend/docker
	cp -Rf ../../backend/docker/php.ini devel/backend/docker
	for i in `ls ../../backend | grep -v docker | grep -v sessions`; do cp -Rf ../../backend/$$i devel/backend; done
	for i in `ls | grep -v devel`; do cp -Rf $$i devel/backend/docker; done
	cp -Rf ../../docs devel

devel: check-keys
	cp -f dockerfiles/devel Dockerfile

production:
	mkdir -p devel/backend/docker
	cp -f dockerfiles/production Dockerfile

check-keys:
	mkdir -p devel/backend/docker
	perl preinstall/check-keys

run:
	docker run -d -p $(PORT):80 --name genedive-local genedive

stop:
	docker stop genedive-local

clean: 
	rm -f Dockerfile
	rm -Rf devel
	docker rm genedive-local

shell:
	docker exec -it genedive-local /bin/bash

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
	docker build -t genedive-v3.0 .
	@echo Cleaning up GeneDive application cache
	rm -Rf devel

cache:
	@echo Cloning the GeneDive application for Docker installation
	mkdir -p devel/backend/docker
	cp	../../.gitignore \
		../../LICENSE \
		devel
	cp -Rf ../../.git \
		../../frontend \
		devel
	cp ../../backend/docker/php.ini devel/backend/docker
	cp -Rf ../../backend/docker/install devel/backend/docker
	for i in `ls ../../backend | grep -v docker | grep -v sessions`; do cp -Rf ../../backend/$$i devel/backend; done
	for i in `ls | grep -v devel`; do cp -Rf $$i devel/backend/docker; done
	cp -Rf ../../docs devel
	cp -Rf ../../automation devel

devel: check-keys
	cp -f dockerfiles/devel Dockerfile

push:
	./bin/push

push-test:
	./bin/push --dry

production:
	mkdir -p devel/backend/docker
	cp -f dockerfiles/production Dockerfile

check-keys:
	mkdir -p devel/backend/docker
	perl preinstall/check-keys

run:
	docker run -d -p $(PORT):80 --name genedive3.0-local genedive-v3.0

stop:
	docker stop genedive3.0-local

clean: 
	rm -f Dockerfile
	rm -Rf devel
	docker rm -f genedive3.0-local

shell:
	docker exec -it genedive3.0-local /bin/bash

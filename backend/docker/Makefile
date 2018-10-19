
build:
	@echo Cloning the GeneDive application for Docker installation
	cp -Rf ../../frontend .
	docker build -t genedive .
	@echo Cleaning up GeneDive application cache
	rm -Rf frontend

run:
	docker run -d -p 8080:80 --name genedive-local genedive

stop:
	docker stop genedive-local

clean: stop
	docker rm genedive-local


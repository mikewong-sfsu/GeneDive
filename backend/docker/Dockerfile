FROM php:7.2-apache
COPY frontend /var/www/html
RUN apt-get update && \
	apt-get install -y apt-utils sqlite3 libsqlite3-dev python3-pip

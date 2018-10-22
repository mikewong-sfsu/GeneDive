FROM php:7.2-apache
COPY frontend /var/www/html
RUN apt-get update && \
	apt-get install -y apt-utils sqlite3 libsqlite3-dev python3-pip && \
	mkdir -p /usr/local/genedive /usr/local/genedive/sessions && \
	chmod a+w /usr/local/genedive/sessions
COPY data /usr/local/genedive/data
RUN chmod a+w /usr/local/genedive/data /usr/local/genedive/data/users.sqlite
COPY preprocessing /usr/local/genedive

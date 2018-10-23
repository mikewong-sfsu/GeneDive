FROM php:7.2-apache
COPY frontend /var/www/html
RUN mkdir /usr/local/genedive
COPY install /usr/local/genedive/install
RUN sh /usr/local/genedive/install/setup.sh
COPY data /usr/local/genedive/data
RUN chmod a+w /usr/local/genedive/data /usr/local/genedive/data/users.sqlite
COPY preprocessing /usr/local/genedive
RUN sh /usr/local/genedive/install/link.sh

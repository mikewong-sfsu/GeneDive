FROM php:7.2-apache
COPY frontend /var/www/html
RUN apt-get update && \
	apt-get install -y apt-utils sqlite3 libsqlite3-dev python3-pip && \
	mkdir -p /usr/local/genedive /usr/local/genedive/sessions /var/www/html/static/genedive/json && \
	chmod a+w /usr/local/genedive/sessions
COPY data /usr/local/genedive/data
RUN chmod a+w /usr/local/genedive/data /usr/local/genedive/data/users.sqlite
COPY preprocessing /usr/local/genedive
RUN ln -s /usr/local/genedive/data/data.all.sqlite /usr/local/genedive/data/data.sqlite && \
	ln -s /usr/local/genedive/data/json.all/symbol_id.json             /var/www/html/static/genedive/json/symbol_id.json        && \
	ln -s /usr/local/genedive/data/json.all/gene_id.json               /var/www/html/static/genedive/json/gene_id.json          && \
	ln -s /usr/local/genedive/data/json.all/chemical_id.json           /var/www/html/static/genedive/json/chemical_id.json      && \
	ln -s /usr/local/genedive/data/json.all/disease_id.json            /var/www/html/static/genedive/json/disease_id.json       && \
	ln -s /usr/local/genedive/data/json.all/matrix_id.json             /var/www/html/static/genedive/json/matrix_id.json        && \
	ln -s /usr/local/genedive/data/json.all/adjacency_matrix.json.zip  /var/www/html/static/genedive/json/adjacency_matrix.json

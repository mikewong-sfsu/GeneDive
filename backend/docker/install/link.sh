## Link the current test data for immediate usage
if [ ! -L /usr/local/genedive/data/data.sqlite                         ]; then ln -s /usr/local/genedive/data/sources/all/data.all.sqlite            /usr/local/genedive/data/data.sqlite;                         fi
if [ ! -L /var/www/html/static/genedive/json/symbol_id.json            ]; then ln -s /usr/local/genedive/data/sources/all/symbol_id.json             /var/www/html/static/genedive/json/symbol_id.json;            fi
if [ ! -L /var/www/html/static/genedive/json/gene_id.json              ]; then ln -s /usr/local/genedive/data/sources/all/gene_id.json               /var/www/html/static/genedive/json/gene_id.json;              fi
if [ ! -L /var/www/html/static/genedive/json/chemical_id.json          ]; then ln -s /usr/local/genedive/data/sources/all/chemical_id.json           /var/www/html/static/genedive/json/chemical_id.json;          fi
if [ ! -L /var/www/html/static/genedive/json/disease_id.json           ]; then ln -s /usr/local/genedive/data/sources/all/disease_id.json            /var/www/html/static/genedive/json/disease_id.json;           fi
if [ ! -L /var/www/html/static/genedive/json/adjacency_matrix.json.zip ]; then ln -s /usr/local/genedive/data/sources/all/adjacency_matrix.json.zip  /var/www/html/static/genedive/json/adjacency_matrix.json.zip; fi

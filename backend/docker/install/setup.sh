#! /bin/sh

# Create path for frontend cache files
mkdir -p /var/www/html/static/genedive/json

# Update OS and install SQLite3 and Python utilities
# apt-get update
# apt-get install -y apt-utils
# apt-get install -y \
# 	sqlite3 \
# 	libsqlite3-dev \
# 	python3-pip

# Create path for sessions
mkdir -p /usr/local/genedive/sessions 
chmod a+w /usr/local/genedive/sessions

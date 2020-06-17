#! /bin/sh

# Update OS and install SQLite3 and Python utilities
apt-get update
apt-get install -y apt-utils
apt-get install -y \
        build-essential \
        libssl-dev \
        sqlite3 \
        libsqlite3-dev \
        python3-pip \
        libzip-dev \
        zip

# Add Zip extensions to PHP 7.2
docker-php-ext-configure zip --with-libzip
docker-php-ext-install zip

# Install Perl Module Manager and Modules
curl -L https://cpanmin.us | perl - App::cpanminus
cpanm install \
        List::Util \
        Text::CSV \
        JSON::XS \
	Array::Utils

# Delete paths
rm -rf /usr/local/genedive /var/www/html
ln -s /genedive/backend /usr/local/genedive
ln -s /genedive/frontend /var/www/html

# Allow access to genedive path
chmod a+rx /genedive

# Create path for sessions
mkdir -p /usr/local/genedive/sessions
chmod a+w /usr/local/genedive/sessions

# Allow permissions so user database can be updated for registrations
chmod a+w /genedive/backend/data /genedive/backend/data/users.sqlite

# Allow permissions to allow autovivification of manifest.json from server default
chmod a+w /genedive/backend/data/sources

# Allow permissions to update cache
chmod a+w /genedive/frontend/cache

#Allow permissions to edit plugin systems
chmod a+w /genedive/frontend/static/genedive/filter/plugin
chmod a+w /genedive/frontend/static/genedive/highlight/plugin
chmod a+w /genedive/frontend/static/genedive/view/table/plugin

# Install default configuration files
cp /genedive/backend/data/sources/manifest.server-default.json /genedive/backend/data/sources.manifest.json
#cp /genedive/backend/data/sources/manifest.server-default.json /genedive/backend/data/sources/manifest.json
cp /genedive/backend/data/credentials-default.php /genedive/backend/data/credentials.php

# Install NodeJS v10 & Puppeteer system dependencies
curl -sL https://deb.nodesource.com/setup_10.x | bash -
apt-get install -y nodejs
apt-get install -y libx11-xcb-dev libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 libatk1.0-0 libatk-bridge2.0-0 libpangocairo-1.0-0 libgtk-3-0
cd /usr/lib/node_modules && npm i puppeteer
apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
npm install -g glob imap stopword request request-promise mathjs mixwith

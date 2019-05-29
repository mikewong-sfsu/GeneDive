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
        JSON::XS

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

#! /bin/sh

# Update development tools
apt-get update
apt-get install -y \
        apt-utils \
		gnupg2 \            # GPG for secure communication
        git \               # git for source code versioning
        vim \               # vim for vasic text editing
		iputils-ping \      # ping to test/debug network setup
		telnet              # telnet to open network communication for testing/debugging

# Get NodeJS v10 and Puppeteer
curl -sL https://deb.nodesource.com/setup_10.x | bash -
apt-get install -y nodejs
cd /usr/lib/node_modules && npm i puppeteer

# Add keys
mkdir -p /root/.ssh
chmod 700 /root/.ssh
cp /genedive/backend/docker/genedive-github*.key /root/.ssh
chmod 400 /root/.ssh/genedive-github*.key

# Add SSH agent commands and Node Modules path to .bashrc 
cat << EOF >> /root/.bashrc
eval \`ssh-agent -s\` > /dev/null 2>&1
ssh-add -D 2>/dev/null
ssh-add /root/.ssh/genedive-github.key 2>/dev/null
export NODE_PATH=\`npm root -g\`
EOF

cat << EOF > /root/.ssh/config
Host github.com
	StrictHostKeyChecking no
EOF

# Get the latest from the repository
eval `ssh-agent -s` > /dev/null 2>&1
ssh-add -D 2>/dev/null
ssh-add /root/.ssh/genedive-github.key 2>/dev/null
cd /genedive && git pull


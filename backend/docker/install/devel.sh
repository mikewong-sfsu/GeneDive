#! /bin/sh

# Update development tools
apt-get update
apt-get install -y \
        apt-utils \
        git \
        vim

# Add keys
mkdir -p /root/.ssh
chmod 700 /root/.ssh
cp /genedive/backend/docker/genedive-github*.key /root/.ssh
chmod 400 /root/.ssh/genedive-github*.key

# Add SSH agent commands to .bashrc 
cat << EOF >> /root/.bashrc
eval \`ssh-agent -s\` > /dev/null 2>&1
ssh-add -D 2>/dev/null
ssh-add /root/.ssh/genedive-github.key 2>/dev/null
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

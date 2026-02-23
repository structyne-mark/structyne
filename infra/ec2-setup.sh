#!/usr/bin/env bash
# EC2 user_data bootstrap script (templated by Terraform)
set -euo pipefail

echo "==> Installing Docker"
dnf install -y docker
systemctl enable --now docker
usermod -aG docker ec2-user

echo "==> Installing Docker Compose plugin"
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-aarch64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

echo "==> Logging in to GHCR"
echo "${github_pat}" | docker login ghcr.io -u "${github_username}" --password-stdin

echo "==> Writing docker-compose.yml"
mkdir -p /opt/structyne
cat > /opt/structyne/docker-compose.yml << 'COMPOSE_EOF'
${docker_compose_yml}
COMPOSE_EOF

echo "==> Creating deploy script"
cat > /opt/deploy.sh << 'DEPLOY_EOF'
#!/usr/bin/env bash
set -euo pipefail
cd /opt/structyne
docker compose pull public-app
docker compose up -d --remove-orphans
docker image prune -f
DEPLOY_EOF
chmod +x /opt/deploy.sh

echo "==> Setup complete"

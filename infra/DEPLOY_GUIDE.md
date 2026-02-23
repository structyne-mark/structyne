# Deploy public-app to EC2 with Cloudflare Tunnel

## Architecture

```
User → Cloudflare (structyne.com) → cloudflared container (EC2) → public-app container (port 4000)
```

Everything runs on a single t4g.nano EC2 instance (~$3/month). Cloudflare Tunnel handles HTTPS and ingress — no ports need to be open to the internet except SSH for deploys.

---

## Prerequisites

> All on your **local machine**.

1. Install [Terraform](https://developer.hashicorp.com/terraform/install) and [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
2. Configure AWS credentials: `aws configure`
3. Create an SSH key pair:
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/structyne-ec2 -N ""
   ```
4. Create a GitHub PAT (classic) with `read:packages` scope for GHCR access

## 1. Create Cloudflare Tunnel

> In the **Cloudflare dashboard** (browser).

1. Go to **Cloudflare Zero Trust → Networks → Tunnels → Create a tunnel**
2. Choose **Cloudflared** connector
3. Name it `structyne`
4. Copy the tunnel token (you'll add it as a GitHub secret in step 3)
5. Add public hostname routes:
   - `structyne.com` → `http://public-app:4000`
   - `www.structyne.com` → `http://public-app:4000`

## 2. Provision Infrastructure

> On your **local machine**, from the repo root.

```bash
cd infra
terraform init
terraform apply \
  -var="github_username=YOUR_GITHUB_USER" \
  -var="github_pat=YOUR_GITHUB_PAT"
```

Or use a `terraform.tfvars` file (git-ignored):

```hcl
github_username = "your-github-user"
github_pat      = "ghp_xxxxxxxxxxxx"
```

Terraform creates: EC2 instance, security group, key pair, elastic IP. It outputs the public IP and SSH command.

## 3. Set Up GitHub Secrets

> In the **GitHub dashboard** (browser).

Go to **GitHub → structyne repo → Settings → Secrets and variables → Actions** and add:

- **`EC2_HOST`**: The elastic IP from Terraform output
- **`EC2_USER`**: `ec2-user`
- **`EC2_SSH_KEY`**: Full contents of `~/.ssh/structyne-ec2` (run `cat ~/.ssh/structyne-ec2` locally and paste)
- **`CF_TUNNEL_TOKEN`**: The tunnel token from step 1

The deploy workflow writes the tunnel token to `/opt/structyne/.env` on each deploy, so the token is never baked into the instance image.

## 4. First Deploy

> Option A: Trigger via **GitHub** — create a release in the repo. The workflow handles everything.
>
> Option B: **SSH into EC2** manually from your local machine:

```bash
# Local machine — connect to EC2
ssh -i ~/.ssh/structyne-ec2 ec2-user@<PUBLIC_IP>
```

Then on the **EC2 instance**:

```bash
# Write the .env (only needed for manual first deploy)
echo "TUNNEL_TOKEN=your-token-here" | sudo tee /opt/structyne/.env > /dev/null
sudo chmod 600 /opt/structyne/.env

sudo /opt/deploy.sh
```

Verify (still on **EC2**):

```bash
sudo docker compose -f /opt/structyne/docker-compose.yml ps
curl http://localhost:4000
```

Then open `https://structyne.com` in your browser. Subsequent deploys are automatic on each GitHub release.

---

## Troubleshooting

> All troubleshooting commands run on the **EC2 instance** (via SSH) unless noted otherwise.

### Check container status

```bash
sudo docker compose -f /opt/structyne/docker-compose.yml ps
sudo docker compose -f /opt/structyne/docker-compose.yml logs public-app
sudo docker compose -f /opt/structyne/docker-compose.yml logs cloudflared
```

### Restart everything

```bash
sudo /opt/deploy.sh
```

### Cloudflared not connecting

```bash
sudo docker compose -f /opt/structyne/docker-compose.yml logs cloudflared
cat /opt/structyne/.env  # verify tunnel token is set
```

### SSH deploy failing

Run these on your **local machine**:

- Verify the instance is running: `terraform output public_ip` (from `infra/`)
- Test SSH: `ssh -i ~/.ssh/structyne-ec2 ec2-user@$(terraform output -raw public_ip) "echo ok"`
- Verify the `EC2_SSH_KEY` secret has the full private key contents

### Out of memory on t4g.nano

```bash
sudo fallocate -l 512M /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
```

### Destroy infrastructure

From your **local machine** (from `infra/`):

```bash
terraform destroy
```

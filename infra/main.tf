terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# --- AMI ---

data "aws_ami" "al2023_arm" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-arm64"]
  }

  filter {
    name   = "architecture"
    values = ["arm64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# --- Key Pair ---

resource "aws_key_pair" "main" {
  key_name   = var.key_name
  public_key = file(pathexpand(var.public_key_path))
}

# --- Security Group ---

resource "aws_security_group" "main" {
  name        = "structyne-ec2"
  description = "SSH access for Structyne EC2"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- EC2 Instance ---

resource "aws_instance" "main" {
  ami                    = data.aws_ami.al2023_arm.id
  instance_type          = "t4g.nano"
  key_name               = aws_key_pair.main.key_name
  vpc_security_group_ids = [aws_security_group.main.id]

  root_block_device {
    volume_size = 8
    volume_type = "gp3"
  }

  user_data = templatefile("${path.module}/ec2-setup.sh", {
    github_username    = var.github_username
    github_pat         = var.github_pat
    docker_compose_yml = file("${path.module}/docker-compose.yml")
  })

  tags = {
    Name = "structyne-public"
  }
}

# --- Elastic IP ---

resource "aws_eip" "main" {
  domain = "vpc"
}

resource "aws_eip_association" "main" {
  instance_id   = aws_instance.main.id
  allocation_id = aws_eip.main.id
}

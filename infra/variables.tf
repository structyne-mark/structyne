variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "ca-central-1"
}

variable "key_name" {
  description = "Name for the EC2 key pair"
  type        = string
  default     = "structyne-ec2"
}

variable "public_key_path" {
  description = "Path to the SSH public key file"
  type        = string
  default     = "~/.ssh/structyne-ec2.pub"
}

variable "github_username" {
  description = "GitHub username for GHCR login"
  type        = string
}

variable "github_pat" {
  description = "GitHub PAT with read:packages scope for GHCR login"
  type        = string
  sensitive   = true
}

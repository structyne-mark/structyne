output "public_ip" {
  description = "Elastic IP of the EC2 instance"
  value       = aws_eip.main.public_ip
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ~/.ssh/${var.key_name} ec2-user@${aws_eip.main.public_ip}"
}

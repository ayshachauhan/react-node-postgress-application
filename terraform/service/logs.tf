resource "aws_cloudwatch_log_group" "log_group" {
  name              = "azentia-${var.environment}-${var.service}-log-group"
  retention_in_days = 5

  tags = {
    Name        = "azentia-${var.environment}-${var.service}-log-group"
    Environment = var.environment
    Creator     = "Terraform"
  }
}
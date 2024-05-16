resource "aws_ecs_cluster" "azentia_cluster" {
  name = "azentia-${var.environment}-cluster"

  tags = {
    Name        = "azentia-${var.environment}-server"
    Environment = var.environment
    Creator     = "Terraform"
  }
}


resource "aws_ecs_cluster_capacity_providers" "azentia_cluste_capacity" {
  cluster_name = aws_ecs_cluster.azentia_cluster.name

  capacity_providers = ["FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE_SPOT"
  }
}
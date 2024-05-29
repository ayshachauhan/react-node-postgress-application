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

resource "aws_security_group" "service_security_group" {
  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    # Only allowing traffic in from the load balancer security group
    security_groups = [aws_security_group.load_balancer_security_group.id]
  }

  egress {
    from_port   = 0             # Allowing any incoming port
    to_port     = 0             # Allowing any outgoing port
    protocol    = "-1"          # Allowing any outgoing protocol 
    cidr_blocks = ["0.0.0.0/0"] # Allowing traffic out to all IP addresses
  }
}
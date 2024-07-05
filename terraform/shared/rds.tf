resource "aws_security_group" "postgres" {
  name_prefix = "azentia-infra-${var.environment}-db-sg"
  description = "Security access rules for Postgres."
  vpc_id      = aws_vpc.azentia-aws-vpc.id

  ingress {
    description = "Allow incoming traffic from thinksys"
    protocol    = "tcp"  # TCP protocol for PostgreSQL
    from_port   = 5432   # PostgreSQL default port
    to_port     = 5432   # PostgreSQL default port
    cidr_blocks = ["115.112.99.50/32"]
  }

  ingress {
    description = "Allow incoming traffic from thinksys"
    protocol    = "tcp"  # TCP protocol for PostgreSQL
    from_port   = 5432   # PostgreSQL default port
    to_port     = 5432   # PostgreSQL default port
    cidr_blocks = ["182.74.161.50/32"]
  }

  ingress {
    description = "Allow all traffice"
    protocol    = "-1"  # TCP protocol for PostgreSQL
    from_port   = 0   # PostgreSQL default port
    to_port     = 0   # PostgreSQL default port
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow incoming traffic ECS"
    protocol    = "tcp"  # TCP protocol for PostgreSQL
    from_port   = 5432   # PostgreSQL default port
    to_port     = 5432   # PostgreSQL default port
    security_groups = [aws_security_group.service_security_group.id]
  }

  egress {
    description = "Allow all outbound traffic."
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "azentia-infra-${var.environment}-db"
    Creator = "Terraform"
  }
}

resource "aws_db_parameter_group" "postgres16" {
  name   = "azentia-infra-${var.environment}-db-parameter-group"
  family = "postgres16"

  dynamic "parameter" {
    for_each = [
      {
        name         = "rds.force_ssl"
        value        = "0"
        apply_method = "pending-reboot"
      },
      {
        name         = "log_statement"
        value        = "all"
        apply_method = "immediate"
      },
      {
        name         = "log_min_duration_statement"
        value        = "0"
        apply_method = "immediate"
      },
      {
        name         = "log_connections"
        value        = "1"
        apply_method = "immediate"
      },
      {
        name         = "log_disconnections"
        value        = "1"
        apply_method = "immediate"
      }
    ]
    content {
      apply_method = lookup(parameter.value, "apply_method", null)
      name         = parameter.value.name
      value        = parameter.value.value
    }
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = {
     Name = "azentia-infra-${var.environment}-db"
     Creator = "Terraform"
  }
}

resource "aws_db_subnet_group" "postgres_public" {
  name       = "main-app"
  subnet_ids = var.subnet_ids
}

resource "aws_db_instance" "main" {
  identifier = "azentia-infra-${var.environment}-db"
  port       = "5432"
  username   = lookup(var.environment_variables, "DB_USERNAME")
  password   = lookup(var.environment_variables, "DB_PASSWORD")
  db_name    = lookup(var.environment_variables, "DB_DATABASE")
  parameter_group_name = aws_db_parameter_group.postgres16.name
  apply_immediately    = true
  engine               = "postgres"
  engine_version       = "16.1"
  instance_class       = "db.t3.medium"
  storage_type         = "gp2"

  allocated_storage            = 20
  max_allocated_storage        = 50
  backup_retention_period      = 3
  performance_insights_enabled = false
  publicly_accessible          = true
  monitoring_interval          = 0
  db_subnet_group_name      = aws_db_subnet_group.postgres_public.id
  # vpc_security_group_ids    = [aws_security_group.postgres_public.id]
  storage_encrypted         = false
  vpc_security_group_ids = [aws_security_group.postgres.id]

  tags = {
    Name = "azentia-infra-${var.environment}-db"
    Creator = "Terraform"
  }
}
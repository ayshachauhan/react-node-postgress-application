resource "aws_security_group" "postgres" {
  name_prefix = "azentia-infra-${var.environment}-db-sg"
  description = "Security access rules for Postgres."
  vpc_id      = aws_default_vpc.default_vpc.id

  ingress {
    description = "AAllow all incoming traffic."
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
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
  name   = "${var.platform}-env-${var.environment}-postgres16"
  family = "postgres16"

  dynamic "parameter" {
    for_each = [
      {
        name         = "rds.force_ssl"
        value        = "ddl"
        apply_method = "0"
      },
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
  instance_class       = "db.t4g.micro"
  storage_type         = "gp2"

  allocated_storage            = 20
  max_allocated_storage        = 50
  backup_retention_period      = 3
  performance_insights_enabled = false
  publicly_accessible          = true
  monitoring_interval          = 0

  # db_subnet_group_name      = aws_db_subnet_group.postgres_public.id
  # vpc_security_group_ids    = [aws_security_group.postgres_public.id]
  storage_encrypted         = false
  vpc_security_group_ids = [aws_security_group.postgres.id]

  tags = {
    Name = "azentia-infra-${var.environment}-db"
    Creator = "Terraform"
  }
}
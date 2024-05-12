locals {
  microservice_vars = [for k, v in merge(var.environment_variables, var.environment_variables_override) :
    templatefile("${path.module}/../templates/environment_variable.tpl.json",
      {
        name  = k,
        value = sensitive(v)
      }
    )
  ]
}

data "aws_ecs_task_definition" "azentia_task" {
  task_definition = aws_ecs_task_definition.azentia_task.family
}

resource "aws_ecs_task_definition" "azentia_task" {
  family                   = "azentia-${var.service}-task" # Naming our first task
  container_definitions    = <<DEFINITION
  [
    {
      "name": "azentia-${var.service}-task",
      "image": "${data.aws_ecr_repository.azentia_image_repository.repository_url}:${var.image_tag}",
      "essential": true,
      "portMappings": [
        {
          "containerPort": ${var.port},
          "hostPort": ${var.port}
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "azentia-${var.environment}-${var.service}-log-group",
          "awslogs-region": "${var.aws_region}",
          "awslogs-stream-prefix": "ecs"
        }
    },
      "environment":[${join(",", local.microservice_vars)}],
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"] # Stating that we are using ECS Fargate
  network_mode             = "awsvpc"    # Using awsvpc as our network mode as this is required for Fargate
  memory                   = 512         # Specifying the memory our container requires
  cpu                      = 256         # Specifying the CPU our container requires
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn
  tags = {
    Name        = "azentia-${var.service}-task"
    Environment = var.environment
    Creator     = "Terraform"
  }
}

resource "aws_ecs_service" "azentia_service" {
  name                 = "azentia-${var.service}-service"         # Naming our first service
  cluster              = var.cluster_id      # Referencing our created Cluster
  task_definition      = aws_ecs_task_definition.azentia_task.arn # Referencing the task our service will spin up
  launch_type          = "FARGATE"
  desired_count        = 1 # Setting the number of containers we want deployed to 3
  force_new_deployment = true

  load_balancer {
    target_group_arn = aws_lb_target_group.azentia_push_target_group.arn # Referencing our target group
    container_name   = aws_ecs_task_definition.azentia_task.family
    container_port   = var.port # Specifying the container port
  }

  network_configuration {
    subnets          = ["${aws_default_subnet.default_subnet_a.id}", "${aws_default_subnet.default_subnet_b.id}", "${aws_default_subnet.default_subnet_c.id}"]
    assign_public_ip = true # Providing our containers with public IPs
    security_groups  = ["${aws_security_group.service_security_group.id}"]
  }
  tags = {
    Name        = "azentia-${var.service}-server"
    Environment = var.environment
    Creator     = "Terraform"
  }
}

resource "aws_security_group" "service_security_group" {
  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    # Only allowing traffic in from the load balancer security group
    security_groups = ["${aws_security_group.load_balancer_security_group.id}"]
  }

  egress {
    from_port   = 0             # Allowing any incoming port
    to_port     = 0             # Allowing any outgoing port
    protocol    = "-1"          # Allowing any outgoing protocol 
    cidr_blocks = ["0.0.0.0/0"] # Allowing traffic out to all IP addresses
  }
}


resource "aws_iam_role" "ecsTaskExecutionRole" {
  name               = "ecsTaskExecutionRole${var.service}-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
  tags = {
    Name        = "azentia-${var.service}-server"
    Environment = var.environment
    Creator     = "Terraform"
  }
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_policy" {
  role       = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

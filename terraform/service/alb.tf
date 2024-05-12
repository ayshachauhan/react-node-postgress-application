resource "aws_alb_target_group" "microservice" {
  name        = "azentia-${var.environment}-${var.service}"
  port        = var.port
  vpc_id      = aws_default_vpc.default_vpc.id
  protocol    = "HTTP"
  target_type = "ip"

  health_check {
    healthy_threshold   = "3"
    interval            = "60"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "10"
    path                = "/health"
    unhealthy_threshold = "5"
  }

  lifecycle {
    create_before_destroy = true
    ignore_changes        = [name]
  }

  tags = {
    Name = "azentia-${var.environment}-${var.service}"
  }
}

resource "aws_lb_listener_rule" "microservice_https_router" {
  listener_arn = var.alb_listeners.https.arn

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.microservice.arn
  }

  condition {
    host_header {
      values = var.host_names
    }
  }
}

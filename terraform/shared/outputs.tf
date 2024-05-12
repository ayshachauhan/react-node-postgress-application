output "cluster_id" {
  value = aws_ecs_cluster.azentia_cluster.id
}

output "rds_endpoint" {
  value = aws_db_instance.main.endpoint
}

output "alb_listeners" {
  value = {
    "https" = aws_alb_listener.https
  }
}

output "load_balancer_security_group_id" {
  value = aws_security_group.load_balancer_security_group.id
}
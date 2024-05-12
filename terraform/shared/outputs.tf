output "cluster_id" {
  value = aws_ecs_cluster.azentia_cluster.id
}

output "rds_endpoint" {
  value = aws_db_instance.main.endpoint
}

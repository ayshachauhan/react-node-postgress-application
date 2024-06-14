output "rds_shared_sg_id" {
  value = module.shared.aws_security_group.postgres.id
}
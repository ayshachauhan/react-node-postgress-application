output "cluster_id" {
  value = aws_ecs_cluster.azentia_cluster.id
}

output "rds_endpoint" {
  value = aws_db_instance.main.address
}

output "alb_listeners" {
  value = {
    "https" = aws_alb_listener.https
  }
}

output "load_balancer_security_group_id" {
  value = aws_security_group.load_balancer_security_group.id
}

output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.azentia-aws-vpc.id
}

output "public_subnet_ids" {
  description = "The IDs of the public subnets"
  value       = [aws_subnet.public-subnet-1.id, aws_subnet.public-subnet-2.id]
}

output "private_subnet_ids" {
  description = "The IDs of the private subnets"
  value       = [aws_subnet.private-subnet-1.id, aws_subnet.private-subnet-2.id]
}

output "public_route_table_id" {
  description = "The ID of the public route table"
  value       = aws_route_table.public-route-table.id
}

output "private_route_table_id" {
  description = "The ID of the private route table"
  value       = aws_route_table.private-route-table.id
}

# output "nat_gateway_id" {
#   description = "The ID of the NAT Gateway"
#   value       = aws_nat_gateway.nat-gw.id
# }

output "internet_gateway_id" {
  description = "The ID of the Internet Gateway"
  value       = aws_internet_gateway.production-new-igw.id
}

# output "elastic_ip_id" {
#   description = "The ID of the Elastic IP used for the NAT Gateway"
#   value       = aws_eip.elastic-ip-for-nat-gw.id
# }

output "public_subnet_1_cidr" {
   description = "cidr of the public subnet"
   value = aws_subnet.public-subnet-1.cidr_block
 }

output "public_subnet_2_cidr" {
   description = "cidr of the public subnet"
   value = aws_subnet.public-subnet-2.cidr_block
 }

output "private_subnet_1_cidr" {
   description = "cidr of the public subnet"
   value = aws_subnet.private-subnet-1.cidr_block
 }

output "private_subnet_2_cidr" {
   description = "cidr of the public subnet"
   value = aws_subnet.private-subnet-2.cidr_block
 }
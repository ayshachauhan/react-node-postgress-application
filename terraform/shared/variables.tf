variable "environment" {
  description = "The development environment (sandbox, development, staging, production)"
}

variable "environment_variables" {
  description = "Map of all the environment variables used by the apps and monitors"
  type        = map
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC."
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones in the region"
  type        = list(string)
}

variable "public_subnets_cidrs" {
  description = "List of CIDR blocks for the public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets_cidrs" {
  description = "List of CIDR blocks for the private subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "region" {
  description = "The AWS region to deploy resources into"
  default     = "us-east-1"
}

# variable "nat_eip_private_ip" {
#   description = "Private IP to associate with the Elastic IP"
# }

# variable "vpc_id" {
#   description = "ID of the VPC where the load balancer and target groups will be deployed"
# }

# variable "public_subnet_ids" {
#   description = "IDs of the public subnets where the load balancer will be deployed"
#   type        = list(string)
# }

# variable "security_group_id" {
#   description = "ID of the security group attached to the load balancer"
# }

# # Providing a reference to our default VPC
# resource "aws_default_vpc" "default_vpc" {
# }

# # Providing a reference to our default subnets
# resource "aws_default_subnet" "default_subnet_a" {
#   availability_zone = "us-east-1a"
# }

# resource "aws_default_subnet" "default_subnet_b" {
#   availability_zone = "us-east-1b"
# }

# resource "aws_default_subnet" "default_subnet_c" {
#   availability_zone = "us-east-1c"
# }

data "aws_vpc" "azentia_aws_vpc" {
  tags = {
    Name = "azentia-${var.environment}-vpc"
  }
}


data "aws_subnets" "public-subnet-1" {
  filter {
    name   = "azentia-public-subnet-1"
    values = [data.aws_vpc.azentia_aws_vpc.id]
  }
}

data "aws_subnets" "public-subnet-2" {
  filter {
    name   = "azentia-public-subnet-2"
    values = [data.aws_vpc.azentia_aws_vpc.id]
  }
}


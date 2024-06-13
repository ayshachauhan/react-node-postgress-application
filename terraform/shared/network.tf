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

# VPC
resource "aws_vpc" "azentia-aws-vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "azentia-${var.environment}-vpc"
  }
}


# Public subnets
resource "aws_subnet" "public-subnet-1" {
  cidr_block        = var.public_subnets_cidrs[0]
  vpc_id            = aws_vpc.azentia-aws-vpc.id
  availability_zone = var.availability_zones[0]

  tags = {
    Name = "azentia-public-subnet-1"
  }
}
resource "aws_subnet" "public-subnet-2" {
  cidr_block        = var.public_subnets_cidrs[1]
  vpc_id            = aws_vpc.azentia-aws-vpc.id
  availability_zone = var.availability_zones[1]

  tags = {
    Name = "azentia-public-subnet-1"
  }
}

# Private subnets
resource "aws_subnet" "private-subnet-1" {
  cidr_block        = var.private_subnets_cidrs[0]
  vpc_id            = aws_vpc.azentia-aws-vpc.id
  availability_zone = var.availability_zones[0]
}
resource "aws_subnet" "private-subnet-2" {
  cidr_block        = var.private_subnets_cidrs[1]
  vpc_id            = aws_vpc.azentia-aws-vpc.id
  availability_zone = var.availability_zones[1]
}

# Route tables for the subnets
resource "aws_route_table" "public-route-table" {
  vpc_id = aws_vpc.azentia-aws-vpc.id
}
resource "aws_route_table" "private-route-table" {
  vpc_id = aws_vpc.azentia-aws-vpc.id
}

# Associate the newly created route tables to the subnets
resource "aws_route_table_association" "public-route-1-association" {
  route_table_id = aws_route_table.public-route-table.id
  subnet_id      = aws_subnet.public-subnet-1.id
}
resource "aws_route_table_association" "public-route-2-association" {
  route_table_id = aws_route_table.public-route-table.id
  subnet_id      = aws_subnet.public-subnet-2.id
}
resource "aws_route_table_association" "private-route-1-association" {
  route_table_id = aws_route_table.private-route-table.id
  subnet_id      = aws_subnet.private-subnet-1.id
}
resource "aws_route_table_association" "private-route-2-association" {
  route_table_id = aws_route_table.private-route-table.id
  subnet_id      = aws_subnet.private-subnet-2.id
}

# # Elastic IP
# resource "aws_eip" "elastic-ip-for-nat-gw" {
#   domain                       = "vpc"
#   associate_with_private_ip = var.nat_eip_private_ip
#   depends_on                = [aws_internet_gateway.production-new-igw]
# }

# NAT gateway
# resource "aws_nat_gateway" "nat-gw" {
#   allocation_id = aws_eip.elastic-ip-for-nat-gw.id
#   subnet_id     = aws_subnet.public-subnet-1.id
#   depends_on    = [aws_eip.elastic-ip-for-nat-gw]
# }
# resource "aws_route" "nat-gw-route" {
#   route_table_id         = aws_route_table.private-route-table.id
#   nat_gateway_id         = aws_nat_gateway.nat-gw.id
#   destination_cidr_block = "0.0.0.0/0"
# }

# Internet Gateway for the public subnet
resource "aws_internet_gateway" "production-new-igw" {
  vpc_id = aws_vpc.azentia-aws-vpc.id
}

# Route the public subnet traffic through the Internet Gateway
resource "aws_route" "public-internet-igw-route" {
  route_table_id         = aws_route_table.public-route-table.id
  gateway_id             = aws_internet_gateway.production-new-igw.id
  destination_cidr_block = "0.0.0.0/0"
}


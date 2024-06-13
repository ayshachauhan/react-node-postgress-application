variable "environment" {
  description = "The development environment (qa,production)"
}

variable "image_tag" {
  description = "The tag for the Docker image (git SHA)"
}

variable "aws_access_key_id" {
  description = "AWS Access Key for AWS account to provision resources on."
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS Secret Access Key for AWS account to provision resources on."
  sensitive   = true
}

variable "aws_region" {
  description = "The AWS region resources are created in."
}

variable "environment_variables" {
  description = "Map of all the environment variables used by the apps"
  type        = map(any)
}

 ##### network ######

variable "public_subnet_1_cidr" {
    description = "CIDR Block for Public Subnet 1"
    default     = "10.1.1.0/24"
  }
  variable "public_subnet_2_cidr" {
    description = "CIDR Block for Public Subnet 2"
    default     = "10.1.2.0/24"
  }
  variable "private_subnet_1_cidr" {
    description = "CIDR Block for Private Subnet 1"
    default     = "10.1.3.0/24"
  }
  variable "private_subnet_2_cidr" {
    description = "CIDR Block for Private Subnet 2"
    default     = "10.1.4.0/24"
  }
  variable "availability_zones" {
    description = "Availability zones"
    type        = list(string)
    default     = ["us-east-1a", "us-east-1b"]
  }


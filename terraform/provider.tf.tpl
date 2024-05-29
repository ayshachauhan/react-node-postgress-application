terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
  backend "s3" {
    bucket         = "azentia-terraformstate-bucket"
    key            = "terraform.tfstate" # Replace with the desired path for your state file
    region         = "us-east-1"                      # Replace with your desired AWS region
    encrypt        = true
    dynamodb_table = "azentia_terraformstate_lockid"            # Replace with the name of your DynamoDB table for state locking
  }
  workspaces {
    name = "__WORKSPACE__"
  }
}

provider "aws" {
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
  region     = var.aws_region
}



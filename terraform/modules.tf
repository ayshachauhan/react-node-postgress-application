module "shared" {
  source = "./shared"

  environment           = var.environment
  environment_variables = var.environment_variables
}


module "azentia-backend" {
  source = "./service"

  environment           = var.environment
  image_tag             = var.image_tag
  service               = "backend"
  port                  = 80
  environment_variables = var.environment_variables
  cluster_id            = module.shared.cluster_id
  aws_region            = var.aws_region

  environment_variables_override = {
    DB_HOST = module.shared.rds_endpoint
  }
}


module "azentia-web" {
  source = "./service"

  environment           = var.environment
  image_tag             = var.image_tag
  service               = "web"
  port                  = 80
  environment_variables = var.environment_variables
  cluster_id            = module.shared.cluster_id
  aws_region            = var.aws_region

  environment_variables_override = {}
}

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
  alb_listeners           = module.shared.alb_listeners
  load_balancer_security_group_id = module.shared.load_balancer_security_group_id

  environment_variables_override = {
    DB_HOST = module.shared.rds_endpoint
  }

  host_names = ["api-qa-azentia.anakshiant.in"]
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
  alb_listeners           = module.shared.alb_listeners
  load_balancer_security_group_id = module.shared.load_balancer_security_group_id

  environment_variables_override = {}

  host_names = ["qa-azentia.anakshiant.in"]
}

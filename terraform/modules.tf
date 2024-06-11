module "shared" {
  source = "./shared"

  environment           = var.environment
  environment_variables = var.environment_variables
  availability_zones    = [var.availability_zones[0], var.availability_zones[1]]
  subnet_ids            = [module.shared.public_subnet_ids[0], module.shared.public_subnet_ids[1]]
}


module "azentia-backend" {
  source = "./service"

  environment                     = var.environment
  image_tag                       = var.image_tag
  service                         = "backend"
  port                            = 80
  environment_variables           = var.environment_variables
  cluster_id                      = module.shared.cluster_id
  aws_region                      = var.aws_region
  alb_listeners                   = module.shared.alb_listeners
  load_balancer_security_group_id = module.shared.load_balancer_security_group_id
  service_security_group_id       = module.shared.service_security_group_id
  subnet_ids              = [
    module.shared.public_subnet_ids[0],  # Assuming you want to use public subnets
    module.shared.public_subnet_ids[1]
  ]  


  environment_variables_override = {
    DB_HOST = module.shared.rds_endpoint
  }

  host_names = ["api-${var.environment}.pod111.com"]

  depends_on = [ module.shared ]
}

module "azentia-web" {
  source = "./service"

  environment                     = var.environment
  image_tag                       = var.image_tag
  service                         = "web"
  port                            = 80
  environment_variables           = var.environment_variables
  cluster_id                      = module.shared.cluster_id
  aws_region                      = var.aws_region
  alb_listeners                   = module.shared.alb_listeners
  load_balancer_security_group_id = module.shared.load_balancer_security_group_id
  service_security_group_id       = module.shared.service_security_group_id
  subnet_ids              = [
    module.shared.public_subnet_ids[0],  # Assuming you want to use public subnets
    module.shared.public_subnet_ids[1]
  ]  

  environment_variables_override = {}

  host_names = ["app-${var.environment}.pod111.com"]

  depends_on = [ module.shared ]

}

variable "environment" {
  description = "The development environment (sandbox, development, staging, production)"
}

variable "image_tag" {
  description = "The tag for the Docker image (git SHA)"
}

variable "service" {
  description = "service you want to deploy"
}

variable "port" {
  description = "port at which service will be running"
}

variable "environment_variables" {
  description = "Map of all the environment variables used by the apps and monitors"
  type        = map
}

variable "environment_variables_override" {
  description = "Map of the environment variables used by the app; combined with and overrides `environment_variables`"
  type        = map(any)
  sensitive   = true
}

variable "cluster_id"  {
  description = "AWS Cluster id"
}

variable "aws_region" {
  description = "The AWS region resources are created in."
}

variable "host_names" {
  description = "The host name for the microservice, e.g. `cerberus.useparagon.com`."
  type        = list(string)
}

variable "alb_listeners" {
  description = "The listeners for the application load balancer for the environment."
  type        = map(any)
}

variable "load_balancer_security_group_id" {
  description = "service you want to deploy"
}

variable "service_security_group_id" {
  description = "service you want to deploy"
}





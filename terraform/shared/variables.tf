variable "environment" {
  description = "The development environment (sandbox, development, staging, production)"
}

variable "environment_variables" {
  description = "Map of all the environment variables used by the apps and monitors"
  type        = map
}
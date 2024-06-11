data "aws_ecr_repository" "azentia_image_repository" {
  name = "azentia-${var.environment}-${var.service}-image-repository"
}
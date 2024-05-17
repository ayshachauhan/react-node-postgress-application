data "aws_ecr_repository" "azentia_image_repository" {
  name = "azentia-${var.service}-image-repository"
}
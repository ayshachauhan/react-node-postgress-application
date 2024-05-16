resource "aws_ecr_repository" "azentia_image_repository_backend" {
  name = "azentia-backend-image-repository"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "azentia_image_repository_web" {
  name = "azentia-web-image-repository"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}
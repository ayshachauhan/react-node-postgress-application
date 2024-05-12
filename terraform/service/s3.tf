resource "aws_s3_bucket" "azentia_sdk" {
  bucket = "azentia-sdk-${var.environment}.azentia.io"
  acl    = "public-read"
}

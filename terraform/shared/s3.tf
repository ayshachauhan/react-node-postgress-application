resource "aws_s3_bucket" "azentia-bucket" {
  bucket = "azentia-sdk-${var.environment}"
}

resource "aws_s3_bucket_ownership_controls" "azentia-bucket-control" {
  bucket = aws_s3_bucket.azentia-bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "azentia-bucket-access-block" {
  bucket = aws_s3_bucket.azentia-bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "azentia-bucket-acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.azentia-bucket-control,
    aws_s3_bucket_public_access_block.azentia-bucket-access-block,
  ]

  bucket = aws_s3_bucket.azentia-bucket.id
  acl    = "public-read"
}

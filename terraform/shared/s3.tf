resource "aws_s3_bucket" "azentia-bucket" {
  bucket = "azentia-${var.environment}"

  tags = {
    Name = "azentia-infra-${var.environment}-db"
    Creator = "Terraform"
  }
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

resource "aws_iam_user" "bucket_user" {
  name = "bucket-user-${var.environment}"
  path = "/${var.environment}/"

  tags = {
    Name = "azentia-infra-${var.environment}-db"
    Creator = "Terraform"
  }
}

resource "aws_iam_access_key" "bucket_user" {
  user = aws_iam_user.bucket_user.name
}

data "aws_iam_policy_document" "bucket_user_ro" {
  statement {
    effect    = "Allow"
    actions   = ["s3:*"]
    resources = ["${aws_s3_bucket.azentia-bucket.arn}"]
  }
}

resource "aws_iam_user_policy" "bucket_user_ro" {
  name   = "bucket-policy-${var.environment}"
  user   = aws_iam_user.bucket_user.name
  policy = data.aws_iam_policy_document.bucket_user_ro.json
}


# the IAM user for image upload
resource "aws_iam_user" "image_uploader" {
  name = "azentia-image-uploader-${var.environment}"
  path = "/${var.environment}/"

  tags = {
    Name    = "azentia-infra-${var.environment}-image-uploader"
    Creator = "Terraform"
  }
}

# Create access keys for the new IAM user
resource "aws_iam_access_key" "image_uploader" {
  user = aws_iam_user.image_uploader.name
}

# Define the policy document for uploading images to the S3 bucket
data "aws_iam_policy_document" "image_uploader_policy" {
  statement {
    effect    = "Allow"
    actions   = [
      "s3:PutObject",
      "s3:PutObjectAcl"
    ]
    resources = [
      "${aws_s3_bucket.azentia-bucket.arn}/*"
    ]
  }
}

# Attach the policy to the new IAM user
resource "aws_iam_user_policy" "image_uploader_policy" {
  name   = "azentia-image-uploader-policy-${var.environment}"
  user   = aws_iam_user.image_uploader.name
  policy = data.aws_iam_policy_document.image_uploader_policy.json
}

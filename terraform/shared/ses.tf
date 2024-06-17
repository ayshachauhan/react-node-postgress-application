resource "aws_ses_domain_identity" "azentia_ses" {
  domain = var.domain
}

resource "aws_ses_domain_dkim" "azentia_ses" {
  domain = aws_ses_domain_identity.azentia_ses.domain
}

# resource "aws_ses_domain_identity_verification" "azentia_ses" {
#   domain = aws_ses_domain_identity.azentia_ses.domain
#   depends_on = [aws_ses_domain_identity.azentia_ses]
# }

# resource "aws_ses_domain_mail_from" "azentia_ses" {
#   domain           = var.domain
#   mail_from_domain = var.mail_from_domain
#   behavior_on_mx_failure = "UseDefaultValue"

#   depends_on = [aws_ses_domain_identity.azentia_ses]
# }

# resource "aws_iam_user" "ses_smtp_user" {
#   name = "azentia-ses-smtp-user-${var.environment}"
# }

# resource "aws_iam_user_policy" "ses_smtp_user_policy" {
#   user = aws_iam_user.ses_smtp_user.name

#   policy = jsonencode({
#     "Version": "2012-10-17",
#     "Statement": [
#       {
#         "Effect": "Allow",
#         "Action": [
#           "ses:SendRawEmail",
#           "ses:SendEmail"
#         ],
#         "Resource": "*"
#       }
#     ]
#   })
# }

# resource "aws_iam_access_key" "ses_smtp_user_access_key" {
#   user = aws_iam_user.ses_smtp_user.name
# }
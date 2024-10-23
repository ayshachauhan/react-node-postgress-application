// env-validation.ts

import Joi from 'joi';
import { ENVIRONMENT_VARIABLES } from './environment.enums';

export const ENV_VARIABLES_SCHEMA: Record<ENVIRONMENT_VARIABLES, Joi.Schema> = {
  [ENVIRONMENT_VARIABLES.NODE_ENV]: Joi.string()
    .valid('development', 'production')
    .default('development'),
  [ENVIRONMENT_VARIABLES.ENVIRONMENT]: Joi.string()
    .valid('dev', 'qa', 'prod')
    .default('dev'),
  [ENVIRONMENT_VARIABLES.DB_HOST]: Joi.string().required(),
  [ENVIRONMENT_VARIABLES.BACKEND_PORT]: Joi.number().default(4000),
  [ENVIRONMENT_VARIABLES.DB_PORT]: Joi.number().required(),
  [ENVIRONMENT_VARIABLES.DB_USERNAME]: Joi.string().required(),
  [ENVIRONMENT_VARIABLES.DB_PASSWORD]: Joi.string().required(),
  [ENVIRONMENT_VARIABLES.DB_DATABASE]: Joi.string().required(),
  [ENVIRONMENT_VARIABLES.SMTP_EMAIL]: Joi.string().required(),
  [ENVIRONMENT_VARIABLES.SMTP_USER]: Joi.string().required(),
  [ENVIRONMENT_VARIABLES.SMTP_PASSWORD]: Joi.string().required(),
  [ENVIRONMENT_VARIABLES.SMTP_HOST]: Joi.string().required(),
  [ENVIRONMENT_VARIABLES.SMTP_PORT]: Joi.number().required(),
  [ENVIRONMENT_VARIABLES.JWT_SECRET_KEY]: Joi.string()
    .optional()
    .default('super_secret_key'),
  [ENVIRONMENT_VARIABLES.EXPIRES_IN]: Joi.string().optional().default('1d'),
  [ENVIRONMENT_VARIABLES.SUPER_ADMIN_EMAIL]: Joi.string()
    .optional()
    .default('admin@thinksys.com'),
  [ENVIRONMENT_VARIABLES.SUPER_ADMIN_PASSWORD]: Joi.string()
    .optional()
    .default('$2b$10$9P8VN5pQGFovE7DhgpicB.OlfT7UFe6RQ.wHEQ7ao9ree.HEKTiea'), //admin,
  [ENVIRONMENT_VARIABLES.DEFAULT_USER_PASSWORD]: Joi.string()
    .optional()
    .default('Test@123'),
  [ENVIRONMENT_VARIABLES.FRONT_END_BASE_URL]: Joi.string(),
  [ENVIRONMENT_VARIABLES.NEXT_PUBLIC_API_BASE_URL]: Joi.string(),
  [ENVIRONMENT_VARIABLES.AWS_ACCESS_KEY_ID]: Joi.string().optional(),
  [ENVIRONMENT_VARIABLES.AWS_SECRET_ACCESS_KEY]: Joi.string().optional(),
  [ENVIRONMENT_VARIABLES.AWS_DEFAULT_REGION]: Joi.string().optional(),
  [ENVIRONMENT_VARIABLES.CRON_EMAIL_SENT_LIMIT]: Joi.number().default(10),
  [ENVIRONMENT_VARIABLES.ENABLE_TWILIO_MSGS]: Joi.boolean().default(false),
  [ENVIRONMENT_VARIABLES.TWILIO_ACCOUNT_SID]: Joi.string(),
  [ENVIRONMENT_VARIABLES.TWILIO_AUTH_TOKEN]: Joi.string(),
  [ENVIRONMENT_VARIABLES.TWILIO_AIMSG_WEBHOOK_URL]: Joi.string(),
  [ENVIRONMENT_VARIABLES.TWILIO_PHONE_NUMBER]: Joi.string(),
  [ENVIRONMENT_VARIABLES.SSO_ENABLED]: Joi.boolean().default(false),
  [ENVIRONMENT_VARIABLES.SAML_ISSUER]: Joi.string().optional(),
  [ENVIRONMENT_VARIABLES.SAML_CERT]: Joi.string().optional(),
  [ENVIRONMENT_VARIABLES.SAML_ENTRYPOINT]: Joi.string().optional(),
  [ENVIRONMENT_VARIABLES.OPENAI_API_KEY]: Joi.string().optional(),
  [ENVIRONMENT_VARIABLES.OPENAI_ORGANISATION]: Joi.string().optional(),
  [ENVIRONMENT_VARIABLES.OPENAI_PROJECT]: Joi.string().optional(),
  [ENVIRONMENT_VARIABLES.OPENAI_ASSISTANT_ID]: Joi.string().optional(),
};

export const ENV_VALIDATIONS = Joi.object(ENV_VARIABLES_SCHEMA);

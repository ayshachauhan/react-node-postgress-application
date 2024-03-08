// env-validation.ts

import Joi from 'joi';
import { ENVIRONMENT_VARIABLES } from './environment.enums';

export const ENV_VARIABLES_SCHEMA: Record<ENVIRONMENT_VARIABLES, Joi.Schema> = {
  [ENVIRONMENT_VARIABLES.NODE_ENV]: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  [ENVIRONMENT_VARIABLES.DB_HOST]: Joi.string().required(),
  [ENVIRONMENT_VARIABLES.BACKEND_PORT]: Joi.number().default(4000),
  [ENVIRONMENT_VARIABLES.DB_PORT]: Joi.number().required(),
  [ENVIRONMENT_VARIABLES.DB_USERNAME]: Joi.string().required(),
  [ENVIRONMENT_VARIABLES.DB_PASSWORD]: Joi.string().required(),
  [ENVIRONMENT_VARIABLES.DB_DATABASE]: Joi.string().required(),
  [ENVIRONMENT_VARIABLES.SMTP_EMAIL]: Joi.string().required(),
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
    .default('$2b$10$gt4FY0WCZDp/Wn2A4aZIH.WdRtelB2vmOxdhaRvQpohYp1OXa2DZC'), //thinksys@123,
};

export const ENV_VALIDATIONS = Joi.object(ENV_VARIABLES_SCHEMA);

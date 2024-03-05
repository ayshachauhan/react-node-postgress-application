// env-validation.ts

import Joi from 'joi';
import { ENVIRONMENT_VARIABLES } from './environment.enums';

export const ENV_VARIABLES_SCHEMA = Joi.object({
  [ENVIRONMENT_VARIABLES.NODE_ENV]: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  [ENVIRONMENT_VARIABLES.DB_HOST]: Joi.string().required(),
  [ENVIRONMENT_VARIABLES.BACKEND_PORT]: Joi.number().default(4000),
  [ENVIRONMENT_VARIABLES.DB_PORT]: Joi.number().required(),
  [ENVIRONMENT_VARIABLES.DB_USERNAME]: Joi.string().required(),
  [ENVIRONMENT_VARIABLES.DB_PASSWORD]: Joi.string().required(),
  [ENVIRONMENT_VARIABLES.DB_DATABASE]: Joi.string().required(),
});

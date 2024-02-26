// env-validation.ts

import Joi from "joi";

export const envVariablesSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test", "staging")
    .default("development"),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
});

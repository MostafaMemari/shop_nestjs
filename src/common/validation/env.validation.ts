import * as Joi from '@hapi/joi';

export const envValidationSchema = Joi.object({
  // Application
  PORT: Joi.number().default(3500),

  // Database
  DB_HOST: Joi.string().default('localhost').required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_USERNAME: Joi.string().default('postgres').required(),
  DB_PASSWORD: Joi.string().default('6945').required(),
  DB_NAME: Joi.string().default('shop').required(),
});

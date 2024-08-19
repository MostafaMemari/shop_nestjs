import * as Joi from '@hapi/joi';

export const envValidationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3500),

  // Database
  DB_TYPE: Joi.string().valid('postgres', 'mysql', 'mariadb', 'mongodb').required(),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432).when('DB_TYPE', { is: 'postgres', then: Joi.required() }),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('').allow(''),
  DB_NAME: Joi.string().default('shop'),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
});

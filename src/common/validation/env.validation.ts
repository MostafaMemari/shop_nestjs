import * as Joi from '@hapi/joi';

export const envValidationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid('dev', 'prod', 'production.local', 'aiven').default('dev'),
  PORT: Joi.number().default(3500),

  // Database
  DB_TYPE: Joi.string().valid('postgres', 'mysql', 'mariadb', 'mongodb').required(),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432).when('DB_TYPE', { is: 'postgres', then: Joi.required() }),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('').allow(''),
  DB_NAME: Joi.string().default('shop'),
  DB_SYNCHRONIZE: Joi.number().integer().valid(0, 1).default(0),
  DB_SSL: Joi.number().integer().valid(0, 1).default(0),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),

  // AWS
  AWS_REGION: Joi.string().default('default'),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_BUCKET_NAME: Joi.string().required(),
  AWS_ENDPOINT: Joi.string().required(),
});

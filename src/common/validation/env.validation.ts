import * as Joi from '@hapi/joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
});

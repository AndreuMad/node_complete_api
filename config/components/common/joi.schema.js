const joi = require('joi');

const envEnum = [
  'development',
  'test'
];

module.exports = joi.object({
  NODE_ENV: joi.string().valid(envEnum).required(),
  PORT    : joi.string().required()
}).unknown().required();

const joi = require('joi');

const envEnum = [
  'development',
  'test',
  'production'
];

module.exports = joi.object({
  NODE_ENV   : joi.string().valid(envEnum).required(),
  PORT       : joi.string().required(),
  MONGODB_URI: joi.string().required(),
  JWT_SECRET : joi.string().required()
}).unknown().required();

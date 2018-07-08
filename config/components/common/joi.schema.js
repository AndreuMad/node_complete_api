const joi = require('joi');

const envEnum = [
  'development',
  'test',
  'production'
];

module.exports = joi.object({
  NODE_ENV       : joi.string().valid(envEnum).required(),
  PORT           : joi.string().required(),
  MONGODB_URI    : joi.string().required(),
  JWT_SECRET     : joi.string().required(),
  // SQL database config
  SQL_DB_SERVER  : joi.string().required(),
  SQL_DB_PORT    : joi.number().required(),
  SQL_DB_NAME    : joi.string().required(),
  SQL_DB_USER    : joi.string(),
  SQL_DB_PASSWORD: joi.string(),
  // Mongo Database config
  MONGO_DB_SERVER: joi.string().required(),
  MONGO_DB_NAME  : joi.string().required(),
  MONGO_DB_PORT  : joi.string().required()
}).unknown().required();

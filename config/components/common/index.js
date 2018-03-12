const joi = require('joi');
const schema = require('./joi.schema');

const result = joi.validate(process.env, schema);
const error = result.error;
const envVars = result.value;

if(error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env : envVars.NODE_ENV,
  port: envVars.PORT
};

module.exports = config;

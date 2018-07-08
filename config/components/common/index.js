const joi = require('joi');
const schema = require('./joi.schema');

const result = joi.validate(process.env, schema);
const error = result.error;
const envVars = result.value;

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env          : envVars.NODE_ENV,
  port         : envVars.PORT,
  mongodbUri   : envVars.MONGODB_URI,
  salt         : envVars.JWT_SECRET,
  // SQL database config
  sqlDbServer  : envVars.SQL_DB_SERVER,
  sqlDbPort    : envVars.SQL_DB_PORT,
  sqlDbName    : envVars.SQL_DB_NAME,
  sqlDbUser    : envVars.SQL_DB_USER,
  sqlDbPassword: envVars.SQL_DB_PASSWORD,
  // Mongo Database config
  mongoDbServer: envVars.MONGO_DB_SERVER,
  mongoDbName: envVars.MONGO_DB_NAME,
  mongoDbPort: envVars.MONGO_DB_PORT
};

module.exports = config;

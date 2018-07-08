const config = require('../../config');

module.exports = {
  nodeCompleteApiSQLDatabase: {
    key     : 'nodeCompleteApiSQLDatabase',
    server  : config.sqlDbServer,
    port    : config.sqlDbPort,
    database: config.sqlDbName,
    user    : config.sqlDbUser,
    password: config.sqlDbPassword
  },

  nodeCompleteApiMongoDatabase: {
    key: 'nodeCompleteApiMongoDatabase',
    host: config.mongoDbServer,
    database: config.mongoDbName,
    port: config.mongoDbPort
  }
};

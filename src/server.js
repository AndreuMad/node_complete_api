const http = require('http');
const { databases } = require('./constants');
const sqlDatabaseService = require('./db/mssql');
const config = require('../config');
const port = config.port;

const promisifyListen = require('./utils/promisifyListen');

const app = require('./app');

const server = http.createServer(app);
// const src = app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

const serverService = {
  async start() {
    // initialize connection to database
    await sqlDatabaseService.initialize(databases.nodeCompleteApiSQLDatabase);

    // src listen
    await promisifyListen(server, { port });

    // log info
    console.log(`Server is running on port ${port}`);

    const result = await sqlDatabaseService.getConnection(databases.nodeCompleteApiSQLDatabase.key)
      .request()
      .query('SELECT * FROM cats');

    console.log(result);
    return server;
  },

  async close() {
    await new Promise((resolve) => {
      server.close(() => resolve());
    });
  }
};

module.exports = serverService;

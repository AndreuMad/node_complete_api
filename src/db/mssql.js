const sql = require('mssql');

const connections = {};

module.exports = {
  initialize(dbConfig) {
    const { key: dbKey } = dbConfig;

    const pool = new sql.ConnectionPool(dbConfig);
    connections[dbKey] = pool;

    return pool.connect();
  },

  getConnection(key) {
    if (!connections[key]) {
      throw new Error(`Connection ${key} does not exist`);
    }

    return connections[key];
  },

  closeConnection(key) {
    if (!connections[key]) {
      throw new Error(`Connection ${key} does not exist`);
    }

    if (connections && connections[key]) {
      return connections[key].close();
    }

    return Promise.resolve();
  },

  closeAllConnections() {
    if (!Object.keys(connections).length) {
      return Promise.resolve();
    }

    const tasks = [];
    for (const connection of connections) {
      tasks.push(connection.close());
    }

    return Promise.all(tasks);
  }
};

const dbService = require('../../../db/mssql');
const { databases } = require('../../../constants');
const sqlManager = require('../../../services/sqlManager');

const postCat = async (req, res) => {
  const {
    name,
    age
  } = res.body;

  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const query = sqlManager.getSql();
};

module.exports = {
  postCat
};

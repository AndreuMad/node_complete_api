const path = require('path');
const sql = require('mssql');
const _ = require('lodash');
const dbService = require('../../../db/mssql');
const { databases } = require('../../../constants');
const sqlManager = require('../../../services/sqlManager');

const getCats = async (req, res) => {
  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const getCatsQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'getCats');

  try {
    const sqlResult = await db.request()
      .query(getCatsQuery);

    const result = _.get(sqlResult, 'recordset', '');

    if (result) {
      res.send(result);
    } else {
      res
        .status(404)
        .send({ message: 'Cat not found' });
    }
  } catch (error) {
    res
      .status(500)
      .send();
  }
};

const postCat = async (req, res) => {
  const {
    name,
    age
  } = req.body;

  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const postCatQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'postCat');

  try {
    const sqlResult = await db.request()
      .input('name', sql.NVarChar, name)
      .input('age', sql.Int, age)
      .query(postCatQuery);

    res.send(sqlResult);
  } catch (error) {
    res
      .status(500)
      .send(error);
  }
};

module.exports = {
  getCats,
  postCat
};

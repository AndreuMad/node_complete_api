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

getCat = async (req, res) => {
  const { id } = req.params;
  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const getCatQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'getCat');

  try {
    const sqlResult = await db.request()
      .input('id', id)
      .query(getCatQuery);

    const result = _.get(sqlResult, 'recordset[0]', '');

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

const patchCat = async (req, res) => {
  const {
    name,
    age
  } = req.body;
  const { id } = req.params;

  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const patchCatQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'patchCat');

  try {
    const sqlRequest = db.request()
      .input('id', id);

    if (name) {
      sqlRequest.input('name', sql.NVarChar, name);
    }

    if (age) {
      sqlRequest.input('age', sql.Int, age);
    }

    const sqlResult = await sqlRequest.query(patchCatQuery);

    res.send(sqlResult);
  } catch (error) {
    res
      .status(500)
      .send(error);
  }
};

const deleteCat = async (req, res) => {
  const { id } = req.params;

  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const deleteCatQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'deleteCat');

  try {
    const sqlResult = await db.request()
      .input('id', id)
      .query(deleteCatQuery);

    res.send(sqlResult);
  } catch (error) {
    res
      .status(500)
      .send(error);
  }
};

module.exports = {
  getCats,
  getCat,
  postCat,
  patchCat,
  deleteCat
};

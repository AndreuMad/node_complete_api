const path = require('path');
const sql = require('mssql');
const _ = require('lodash');
const dbService = require('../../../db/mssql');
const { databases } = require('../../../constants');
const sqlManager = require('../../../services/sqlManager');

const getBooks = async (req, res) => {
  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const getBooksQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'getBooks');

  try {
    const sqlResult = await db.request()
      .query(getBooksQuery);

    const result = _.get(sqlResult, 'recordset', '');

    if (result) {
      res.send(result);
    } else {
      res
        .status(404)
        .send({ message: 'Books not found' });
    }
  } catch (error) {
    res
      .status(500)
      .send();
  }
};

getBook = async (req, res) => {
  const { id } = req.params;
  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const getBookQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'getBook');

  try {
    const sqlResult = await db.request()
      .input('id', id)
      .query(getBookQuery);

    const result = _.get(sqlResult, 'recordset[0]', '');

    if (result) {
      res.send(result);
    } else {
      res
        .status(404)
        .send({ message: 'Book not found' });
    }
  } catch (error) {
    res
      .status(500)
      .send();
  }
};

const postBook = async (req, res) => {
  const {
    title,
    authorFirstName,
    authorLastName,
    releasedYear,
    stockQuantity,
    pages
  } = req.body;

  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const postBookQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'postBook');

  try {
    const sqlResult = await db.request()
      .input('title', sql.NVarChar, title)
      .input('author_first_name', sql.NVarChar, authorFirstName)
      .input('author_last_name', sql.NVarChar, authorLastName)
      .input('released_year', sql.Int, releasedYear)
      .input('stock_quantity', sql.Int, stockQuantity)
      .input('pages', sql.Int, pages)
      .query(postBookQuery);

    res.send(sqlResult);
  } catch (error) {
    res
      .status(500)
      .send(error);
  }
};

const patchBook = async (req, res) => {
  const {
    name,
    age
  } = req.body;
  const { id } = req.params;

  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const patchBookQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'patchBook');

  try {
    const sqlRequest = db.request()
      .input('id', id);

    if (name) {
      sqlRequest.input('name', sql.NVarChar, name);
    }

    if (age) {
      sqlRequest.input('age', sql.Int, age);
    }

    const sqlResult = await sqlRequest.query(patchBookQuery);

    res.send(sqlResult);
  } catch (error) {
    res
      .status(500)
      .send(error);
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;

  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const deleteBookQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'deleteBook');

  try {
    const sqlResult = await db.request()
      .input('id', id)
      .query(deleteBookQuery);

    res.send(sqlResult);
  } catch (error) {
    res
      .status(500)
      .send(error);
  }
};

module.exports = {
  getBooks,
  getBook,
  postBook,
  patchBook,
  deleteBook
};

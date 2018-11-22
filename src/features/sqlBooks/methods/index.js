const path = require('path');
const sql = require('mssql');
const _ = require('lodash');
const dbService = require('../../../db/mssql');
const { databases } = require('../../../constants');
const sqlManager = require('../../../services/sqlManager');

const getBooks = async (req, res) => {
  const {
    limit = 10,
    skip = 0
  } = req.query;

  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const getBooksQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'getBooks');

  let sqlResult;

  try {
    sqlResult = await db.request()
      .input('Limit', sql.Int, limit)
      .input('Skip', sql.Int, skip)
      .query(getBooksQuery);
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .send();

    return;
  }

  const books = _.get(sqlResult, 'recordset', []);
  const booksCount = _.get(sqlResult, 'recordsets[1][0].booksCount', null);
  const authorsCount = _.get(sqlResult, 'recordsets[1][0].authorsCount', null);

  res.send({
    books,
    booksCount,
    authorsCount
  });
};

const getBooksYears = async (req, res) => {
  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const getBooksYearsQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'getBooksYears');

  let sqlResult;

  try {
    sqlResult = await db.request()
      .query(getBooksYearsQuery);
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .send();

    return;
  }

  const result = _.get(sqlResult, 'recordset');

  res.send(result);
};

const getBook = async (req, res) => {
  const { id } = req.params;
  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const getBookQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'getBook');

  let sqlResult;

  try {
    sqlResult = await db.request()
      .input('id', id)
      .query(getBookQuery);
  } catch (error) {
    res
      .status(500)
      .send();
  }

  const result = _.get(sqlResult, 'recordset[0]', null);

  if (result) {
    res.send(result);
  } else {
    res
      .status(404)
      .send({ message: 'Book not found' });
  }
};

const searchBooksByTitle = async (req, res) => {
  const { searchQuery } = req.query;

  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const searchBooksByTitleQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'searchBooksByTitle');

  let sqlResult;

  try {
    sqlResult = await db.request()
      .input('SearchQuery', sql.VarChar(255), searchQuery)
      .query(searchBooksByTitleQuery);
  } catch (ex) {
    console.log(ex);
    res
      .status(500)
      .send(ex);
  }

  const result = _.get(sqlResult, 'recordset', []);

  res.send(result);
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

  let sqlResult;
  try {
    sqlResult = await db.request()
      .input('title', sql.NVarChar, title)
      .input('author_first_name', sql.NVarChar, authorFirstName)
      .input('author_last_name', sql.NVarChar, authorLastName)
      .input('released_year', sql.Int, releasedYear)
      .input('stock_quantity', sql.Int, stockQuantity)
      .input('pages', sql.Int, pages)
      .query(postBookQuery);
  } catch (error) {
    res
      .status(500)
      .send(error);
  }

  res.send(sqlResult);
};

const patchBook = async (req, res) => {
  const {
    name,
    age
  } = req.body;
  const { id } = req.params;

  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const patchBookQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'patchBook');

  let sqlResult;

  try {
    const sqlRequest = db.request()
      .input('id', id);

    if (name) {
      sqlRequest.input('name', sql.NVarChar, name);
    }

    if (age) {
      sqlRequest.input('age', sql.Int, age);
    }

    sqlResult = await sqlRequest.query(patchBookQuery);
  } catch (error) {
    res
      .status(500)
      .send(error);
  }

  res.send(sqlResult);
};

const deleteBook = async (req, res) => {
  const { id } = req.params;

  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const deleteBookQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'deleteBook');

  let sqlResult;

  try {
    sqlResult = await db.request()
      .input('id', id)
      .query(deleteBookQuery);
  } catch (error) {
    res
      .status(500)
      .send(error);
  }

  res.send(sqlResult);
};

module.exports = {
  getBooks,
  getBooksYears,
  getBook,
  searchBooksByTitle,
  postBook,
  patchBook,
  deleteBook
};

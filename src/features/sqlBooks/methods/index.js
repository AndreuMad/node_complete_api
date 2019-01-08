const path = require('path');
const sql = require('mssql');
const _ = require('lodash');
const dbService = require('../../../db/mssql');
const { databases } = require('../../../constants');
const sqlManager = require('../../../services/sqlManager');

const getBooks = async (req, res) => {
  const {
    limit = 10,
    skip = 0,
    min_released_year,
    max_released_year,
    author_first_name,
    author_last_name
  } = req.query;

  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const getBooksQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'getBooks');

  let sqlResult;

  try {
    sqlResult = await db.request()
      .input('Limit', sql.Int, limit)
      .input('Skip', sql.Int, skip)
      .input('MinReleasedYear', sql.Int, min_released_year)
      .input('MaxReleasedYear', sql.Int, max_released_year)
      .input('AuthorFirstName', sql.VarChar(255), author_first_name)
      .input('AuthorLastName', sql.VarChar(255), author_last_name)
      .query(getBooksQuery);
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .send();

    return;
  }

  const books = _.get(sqlResult, 'recordset', []);
  const booksCount = _.get(sqlResult, 'recordsets[1][0].books_count', null);
  const authorsCount = _.get(sqlResult, 'recordsets[1][0].authors_count', null);

  res.send({
    books,
    booksCount,
    authorsCount
  });
};

const getBooksAuthors = async (req, res) => {
  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const getBooksAuthorsQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'getBooksAuthors');

  let sqlResult;

  try {
    sqlResult = await db.request()
      .query(getBooksAuthorsQuery);
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

const getAuthorsLatestBook = async (req, res) => {
  const { author } = req.params;

  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const getAuthorsLatestBookQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'getAuthorsLatestBook');

  let sqlResult;

  try {
    sqlResult = await db.request()
      .input('author', author)
      .query(getAuthorsLatestBookQuery);
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

const getBooksByPeriod = async (req, res) => {
  const { period } = req.params;
  const {
    limit = 10,
    skip = 0
  } = req.query;

  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const getBooksByPeriodQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'getBooksByPeriod');

  let sqlResult;

  try {
    sqlResult = await db.request()
      .input('Period', sql.VarChar(16), period)
      .input('Limit', sql.Int, limit)
      .input('Skip', sql.Int, skip)
      .query(getBooksByPeriodQuery);
  } catch (ex) {
    console.log(ex);

    res
      .status(500)
      .send(ex);

    return;
  }

  const books = _.get(sqlResult, 'recordset', []);
  const booksCount = _.get(sqlResult, 'recordsets[1][0].books_count', null);
  const authorsCount = _.get(sqlResult, 'recordsets[1][0].authors_count', null);

  res.send({
    books,
    booksCount,
    authorsCount
  });
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
    console.log(error);
    res
      .status(500)
      .send();

    return;
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
    return;
  }

  const result = _.get(sqlResult, 'recordset', []);

  res.send(result);
};

const postBook = async (req, res) => {
  const {
    title,
    authorId,
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
      .input('author_id', sql.Int, authorId)
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
    title,
    author_id,
    released_year,
    stock_quantity,
    pages
  } = req.body;
  const { id } = req.params;

  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const patchBookQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'patchBook');

  let sqlResult;

  try {
    sqlResult = await db.request()
      .input('id', id)
      .input('title', sql.VarChar(100), title)
      .input('author_id', sql.Int, author_id)
      .input('released_year', sql.Int, released_year)
      .input('stock_quantity', sql.Int, stock_quantity)
      .input('pages', sql.Int, pages)
      .query(patchBookQuery);
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

const getOrders = async (req, res) => {
  const db = dbService.getConnection(databases.nodeCompleteApiSQLDatabase.key);
  const getOrdersQuery = sqlManager.getSql(path.resolve(__dirname, '../'), 'getOrders');

  let sqlResult;

  try {
    sqlResult = await db.request()
      .query(getOrdersQuery);
  } catch (ex) {
    console.log(ex);
    res
      .status(500)
      .send(ex);

    return;
  }

  const result = _.get(sqlResult, 'recordset', []);

  res.send(result);
};

module.exports = {
  getBooks,
  getBooksAuthors,
  getAuthorsLatestBook,
  getBooksByPeriod,
  getBook,
  searchBooksByTitle,
  postBook,
  patchBook,
  deleteBook,

  getOrders
};

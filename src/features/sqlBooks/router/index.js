const express = require('express');
const methods = require('../methods');

const router = express.Router();

router.route('/books/search')
  .get(methods.searchBooksByTitle);

router.route('/books/years')
  .get(methods.getBooksYears)

router.route('/books/:id')
  .get(methods.getBook)
  .patch(methods.patchBook)
  .delete(methods.deleteBook);

router.route('/books')
  .get(methods.getBooks)
  .post(methods.postBook);

module.exports = router;

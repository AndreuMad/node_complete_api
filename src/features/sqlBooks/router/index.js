const express = require('express');
const methods = require('../methods');

const router = express.Router();

router.route('/books/:id')
  .get(methods.getBook)
  .patch(methods.patchBook)
  .delete(methods.deleteBook);

router.route('/books')
  .get(methods.getBooks)
  .post(methods.postBook);

module.exports = router;

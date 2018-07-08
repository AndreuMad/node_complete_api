const express = require('express');
const methods = require('../methods');

const router = express.Router();

router.route('/cats')
  .get(methods.getCats)
  .post(methods.postCat);

module.exports = router;

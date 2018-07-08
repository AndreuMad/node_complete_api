const express = require('express');
const methods = require('../methods');

const router = express.Router();

router.route('/currency/')
  .get(methods.getCurrency);

module.exports = router;

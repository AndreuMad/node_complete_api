const express = require('express');
const methods = require('../methods');

const router = express.Router();

router.route('/cats/:id')
  .get(methods.getCat)
  .patch(methods.patchCat)
  .delete(methods.deleteCat);

router.route('/cats')
  .get(methods.getCats)
  .post(methods.postCat);

module.exports = router;

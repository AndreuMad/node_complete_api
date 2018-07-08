const express = require('express');
const authenticate = require('../../../middlewares/authenticate');
const methods = require('../methods');

const router = express.Router();

router.route('/users')
  .post(methods.postUser);

router.route('/users/login')
  .post(methods.loginUser);

router.route('/users/profile')
  .get(authenticate, methods.getUserProfile);

router.route('/users/profile/token')
  .delete(authenticate, methods.deleteUserToken);

module.exports = router;

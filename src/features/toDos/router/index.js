const express = require('express');
const authenticate = require('../../../middlewares/authenticate');
const methods = require('../methods');

const router = express.Router();

router.route('/todos')
  .get(authenticate, methods.getTodos)
  .post(authenticate, methods.postTodo);

router.route('/todos/:id')
  .get(authenticate, methods.getTodo)
  .patch(authenticate, methods.patchTodo)
  .delete(authenticate, methods.deleteTodo);

module.exports = router;

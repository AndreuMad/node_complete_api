const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoose');

const config = require('../config');
const port = config.port;

const todoRoutes = require('./routes/todo');
const userRoutes = require('./routes/user');

const app = express();
const router = express.Router();

app.use(bodyParser.json());

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Todos
router.route('/todos')
  .get(todoRoutes.getTodos)
  .post(todoRoutes.postTodo);

router.route('/todos/:id')
  .get(todoRoutes.getTodo)
  .patch(todoRoutes.patchTodo)
  .delete(todoRoutes.deleteTodo);

// Users

router.route('/users')
  .post(userRoutes.postUser);

app.use('/', router);

module.exports = {
  app,
  server
};

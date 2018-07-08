const express = require('express');
const bodyParser = require('body-parser');

const mongoDatabaseService = require('./db/mongoose');
const { databases } = require('./constants');

const app = express();
const router = express.Router();

mongoDatabaseService.initialize(databases.nodeCompleteApiMongoDatabase);

// Middlewares
const authenticate = require('./middlewares/authenticate');

// Routes
const todoRoutes = require('./routes/todo');
const userRoutes = require('./routes/user');
const currencyRoutes = require('./routes/currency');

app.use(bodyParser.json());

// Todos
router.route('/todos')
  .get(authenticate, todoRoutes.getTodos)
  .post(authenticate, todoRoutes.postTodo);

router.route('/todos/:id')
  .get(authenticate, todoRoutes.getTodo)
  .patch(authenticate, todoRoutes.patchTodo)
  .delete(authenticate, todoRoutes.deleteTodo);

// Users

router.route('/users')
  .post(userRoutes.postUser);

router.route('/users/login')
  .post(userRoutes.loginUser);

router.route('/users/profile')
  .get(authenticate, userRoutes.getUserProfile);

router.route('/users/profile/token')
  .delete(authenticate, userRoutes.deleteUserToken);

router.route('/currency/')
  .get(currencyRoutes.getCurrency);

app.use('/', router);

module.exports = app;

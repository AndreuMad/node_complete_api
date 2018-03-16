const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoose');

const config = require('../config');
const port = config.port;

const User = require('./models/user');
const ToDo = require('./models/toDo');

const app = express();
const router = express.Router();

app.use(bodyParser.json());

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

router.route('/todos')
  .get((req, res) => {
    ToDo.find()
      .then((todos) => {
        res.send({ todos });
      })
      .catch((error) => {
        res
          .status(400)
          .send(error);
      })
  })
  .post((req, res) => {
    const item = new ToDo({
      text: req.body.text
    });
    item.save()
      .then((item) => {
        res.json(item);
      })
      .catch((error) => {
        res
          .status(400)
          .json(error);
      });
  });

app.use('/', router);

module.exports = {
  app,
  server
};

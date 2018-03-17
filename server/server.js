const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
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

router.route('/todos/:id')
  .get((req, res) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
      return res
        .status(404)
        .send({ error: 'Invalid ObjectId' });
    }

    ToDo.findById(req.params.id)
      .then((todo) => {
        if (todo) {
          res.send({ todo });
        } else {
          res
            .status(404)
            .res.send({});
        }
      })
      .catch((error) => {
        res
          .status(400)
          .send(error);
      });
  });

app.use('/', router);

module.exports = {
  app,
  server
};

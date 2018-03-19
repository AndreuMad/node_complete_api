const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const mongoose = require('./db/mongoose');
const _ = require('lodash');

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

    ToDo.findById(id)
      .then((todo) => {
        if (todo) {
          res.send({ todo });
        } else {
          res
            .status(404)
            .send({});
        }
      })
      .catch((error) => {
        res
          .status(400)
          .send(error);
      });
  })
  .patch((req, res) => {
    const { id } = req.params;
    const body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    ToDo.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    )
      .then((todo) => {
        if (!todo) {
          return res.status(404).send();
        }

        res.send({ todo });
      })
      .catch((error) => {
        res
          .status(404)
          .send({ error });
      });
  })
  .delete((req, res) => {
    const {
      params: { id },
      query: { multiple }
    } = req;

    let queryId = multiple ? id.split(',') : id;
    let invalidIds = [];

    if (multiple) {
      queryId.forEach((idItem) => {
        if (!ObjectID.isValid(idItem)) {
          invalidIds.push(idItem);
        }
      });
    } else {
      if (!ObjectID.isValid(queryId)) {
        invalidIds.push(queryId);
      }
    }

    if (invalidIds.length) {
      return res
        .status(404)
        .send({ error: `Invalid ID: ${invalidIds}` });
    }

    if (multiple) {
      ToDo.remove({
        _id: {
          $in: queryId
        }
      })
        .then((result) => {
          if (result) {
            res.send(result);
          } else {
            res
              .status(404)
              .send();
          }
        })
        .catch((error) => {
          res
            .status(400)
            .send({ error })
        });
    } else {
      ToDo.findByIdAndRemove(queryId)
        .then((todo) => {
          if (todo) {
            res.send({ todo });
          } else {
            res
              .status(404)
              .send();
          }
        })
        .catch((error) => {
          res
            .status(400)
            .send({ error });
        });
    }
  });

app.use('/', router);

module.exports = {
  app,
  server
};

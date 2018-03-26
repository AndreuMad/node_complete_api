const _ = require('lodash');
const { ObjectID } = require('mongodb');
const ToDo = require('../models/toDo');

const getTodos = (req, res) => {
  ToDo.find({
    _creator: req.user._id
  })
    .then((todos) => {

      res.send({ todos });
    })
    .catch((error) => {
      res
        .status(400)
        .send(error);
    })
};

const getTodo = (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res
      .status(404)
      .send({ error: 'Invalid ObjectID' });
  }

  ToDo.findOne({
    _id: id,
    _creator: req.user._id
  })
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
};

const postTodo = (req, res) => {
  const item = new ToDo({
    text: req.body.text,
    _creator: req.user._id
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
};

const patchTodo = (req, res) => {
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

  ToDo.findOneAndUpdate(
    {
      _id: id,
      _creator: req.user._id
    },
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
};

const deleteTodo = (req, res) => {
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
      },
      _creator: req.user._id
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
    ToDo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    })
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
};

module.exports = {
  getTodos,
  getTodo,
  postTodo,
  patchTodo,
  deleteTodo
};

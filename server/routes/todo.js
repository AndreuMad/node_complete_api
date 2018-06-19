const _ = require('lodash');
const { ObjectID } = require('mongodb');
const ToDo = require('../models/toDo');

const getTodos = async (req, res) => {
  try {
    const todos = await ToDo.find({
      _creator: req.user._id
    });

    res.send({ todos });
  } catch (error) {
    res
      .status(400)
      .send(error);
  }
};

const getTodo = async (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res
      .status(404)
      .send({ error: 'Invalid ObjectID' });
  }

  try {
    const todo = await ToDo.findOne({
      _id: id,
      _creator: req.user._id
    });

    if (todo) {
      res.send({ todo });
    } else {
      res
        .status(404)
        .send({});
    }
  } catch (error) {
    res
      .status(400)
      .send(error);
  }
};

const postTodo = async (req, res) => {
  const item = new ToDo({
    text: req.body.text,
    _creator: req.user._id
  });

  try {
    const resultItem = await item.save();

    res.json(resultItem);
  } catch (error) {
    res
      .status(400)
      .json(error);
  }
};

const patchTodo = async (req, res) => {
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

  try {
    const updatedTodo = await ToDo.findOneAndUpdate(
      {
        _id: id,
        _creator: req.user._id
      },
      { $set: body },
      { new: true }
    );

    if (!updatedTodo) {
      res.status(404).send();
    }

    res.send(updatedTodo);
  } catch (error) {
    res
      .status(404)
      .send({ error });
  }
};

const deleteTodo = async (req, res) => {
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
    try {
      const removedTodos = await ToDo.remove({
        _id: {
          $in: queryId
        },
        _creator: req.user._id
      });

      if (removedTodos) {
        res.send(removedTodos);
      } else {
        res
          .status(404)
          .send();
      }
    } catch (error) {
      res
        .status(400)
        .send({ error });
    }
  } else {
    try {
      const removedTodo = await ToDo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
      });

      if (removedTodo) {
        res.send(removedTodo);
      } else {
        res
          .status(404)
          .send();
      }
    } catch (error) {
      res
        .status(400)
        .send({ error });
    }
  }
};

module.exports = {
  getTodos,
  getTodo,
  postTodo,
  patchTodo,
  deleteTodo
};

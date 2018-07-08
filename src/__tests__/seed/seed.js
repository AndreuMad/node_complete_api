const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');
const ToDo = require('../../features/toDos/models');
const User = require('../../features/users/models');

const config = require('../../../config');
const { salt } = config;

const userIDs = [new ObjectID(), new ObjectID()];

// Todos
const todos = [
  {
    _id: new ObjectID(),
    text: 'First todo text',
    _creator: userIDs[0]
  },
  {
    _id: new ObjectID(),
    text: 'Second todo text',
    completed: true,
    _creator: userIDs[1]
  }
];

const populateTodos = (done) => {
  ToDo.remove({})
    .then(() => {
      return ToDo.insertMany(todos);
    })
    .then(() => {
      done();
    });
};

const users = [
  {
    _id: userIDs[0],
    email: 'andrew@example.com',
    password: '123456',
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: userIDs[0], access: 'auth' }, salt).toString()
    }]
  },
  {
    _id: userIDs[1],
    email: 'andrew1@example.com',
    password: '123456',
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: userIDs[1], access: 'auth' }, salt).toString()
    }]
  }
];

const populateUsers = (done) => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done())
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};

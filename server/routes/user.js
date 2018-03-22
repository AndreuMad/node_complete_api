const _ = require('lodash');
const { ObjectID } = require('mongodb');
const User = require('../models/user');

const postUser = (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  user.save()
    .then(user => user.generateAuthToken())
    .then((token) => {
      res
        .header('x-auth', token)
        .json({ user });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error });
    });
};

module.exports = {
  postUser
};

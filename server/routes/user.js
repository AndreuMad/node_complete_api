const _ = require('lodash');
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

const loginUser = (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then((user) => {
      console.log(user);
      return user.generateAuthToken()
        .then((token) => {
          res
            .header('x-auth', token)
            .send({ user });
        })
        .catch((error) => {
          throw error;
        })
      })
    .catch((error) => {
      res
        .status(400)
        .send({ error });
    })
};

const getUserProfile = (req, res) => {
  res.send(req.user);
};

const deleteUserToken = (req, res) => {
  req.user.removeToken(req.token)
    .then(() => {
      res
        .status(200)
        .send();
    })
    .catch((error) => {
      res
        .status(400)
        .send({ error });
    });
};

module.exports = {
  postUser,
  loginUser,
  getUserProfile,
  deleteUserToken
};

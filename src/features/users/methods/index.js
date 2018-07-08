const _ = require('lodash');
const User = require('../models');

const postUser = async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res
      .header('x-auth', token)
      .json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ error });
  }
};

const loginUser = async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  try {
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();

    res
      .header('x-auth', token)
      .send({ user });
  } catch (error) {
    res
      .status(400)
      .send({ error });
  }
};

const getUserProfile = (req, res) => {
  res.send(req.user);
};

const deleteUserToken = async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (error) {
    res.status(400).send({ error });
  }
};

module.exports = {
  postUser,
  loginUser,
  getUserProfile,
  deleteUserToken
};

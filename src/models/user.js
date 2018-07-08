const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { Schema } = require('mongoose');
const { nodeCompleteApiMongoDatabase } = require('../constants').databases;
const mongoDatabaseService = require('../db/mongoose');

const config = require('../../config');
const { salt } = config;

const connection = mongoDatabaseService.getConnection(nodeCompleteApiMongoDatabase.key);

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
  },
  { collection: 'users' }
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  const access = 'auth';
  const token = jwt.sign({ _id: this._id.toHexString(), access }, salt).toString();

  this.tokens.push({ access, token });

  return this.save()
    .then(() => token)
    .catch(error => {
      throw error;
    });
};

UserSchema.methods.removeToken = function (token) {
  const user = this;
  return user.update({
    $pull: {
      tokens: {
        token
      }
    }
  })
};

UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, salt);
  } catch (error) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User.findOne({ email })
    .then(user => {
      if (!user) {
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (error, result) => {
          if (result) {
            resolve(user);
          } else {
            reject(error);
          }
        });
      });
    })
};

UserSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) {

        }
        user.password = hash;
        next();
      });
    })
  } else {
    next();
  }
});

module.exports = connection.models.user || connection.model('user', UserSchema);

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { Schema } = require('mongoose');

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
  const token = jwt.sign({ _id: this._id.toHexString(), access }, 'abc123').toString();

  this.tokens.push({ access, token });

  return this.save()
    .then(() => token)
    .catch((error) => {
      throw error;
    });
};

module.exports = mongoose.models.user || mongoose.model('user', UserSchema);

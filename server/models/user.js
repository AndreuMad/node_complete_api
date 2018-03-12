const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    }
  },
  { collection: 'users1' }
);

module.exports = mongoose.model('user', userSchema);

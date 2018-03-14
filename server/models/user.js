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
  { collection: 'users' }
);

module.exports = mongoose.models.user || mongoose.model('user', userSchema);

const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const toDoSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      minlength: 1,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Number,
      default: null
    },
    _creator: {
      type: Schema.Types.ObjectId,
      required: true,
    }
  },
  { collection: 'todos' }
);

module.exports = mongoose.models.todo || mongoose.model('todo', toDoSchema);

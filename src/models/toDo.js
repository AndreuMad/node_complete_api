const { Schema } = require('mongoose');
const { nodeCompleteApiMongoDatabase } = require('../constants').databases;
const mongoDatabaseService = require('../db/mongoose');

const connection = mongoDatabaseService.getConnection(nodeCompleteApiMongoDatabase.key);

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
  {
    collection: 'todos'
  }
);

module.exports = connection.models.todo || connection.model('todo', toDoSchema);

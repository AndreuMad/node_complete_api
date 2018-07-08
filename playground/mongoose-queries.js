const { ObjectID } = require('mongodb');
const { mongoose } = require('../src/db/mongoose');
const ToDo = require('../src/features/toDos/models/index');

const id = '5aabdfa78b50af7d59c7800a';

ToDo.find({
  _id: id
})
  .then((todos) => {
    console.log('Todos', todos);
  })
  .catch((error) => {
    console.log(error);
  });

ToDo.findOne({
  _id: id
})
  .then((todo) => {
    console.log('Todo', todo);
  })
  .catch((error) => {
    console.log(error);
  });

ToDo.findById(id)
  .then((todo) => {
    if(!todo) {
      return console.log('ID not found');
    }
    console.log('Find by ID', todo);
  })
  .catch((error) => {
    console.log(error);
  });

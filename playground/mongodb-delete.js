const { MongoClient } = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/', (err, database) => {
  if(err) {
    console.log('Enable to connect to database');
    return;
  }

  console.log('Connected to MongoDB src');

  // deleteMany
  database.db('NodeCompleteApi').collection('todos')
    .deleteMany({ completed: true })
    .then(({ result }) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });

  // deleteOne
  // findOneAndDelete

  database.close();
});

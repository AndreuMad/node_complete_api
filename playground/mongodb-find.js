const { MongoClient } = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/', (err, database) => {
  if (err) {
    console.log('Enable to connect to database');
    return;
  }

  console.log('Connected to MongoDB server');
  database.db('NodeCompleteApi').collection('todos')
    .find({
      completed: false
    })
    .toArray()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.log('Unable to find TODO', error);
    });

  database.db('NodeCompleteApi').collection('todos')
    .find({
      completed: false
    })
    .count()
    .then((count) => {
      console.log(`Total count: ${count}`);
    })
    .catch((error) => {
      console.log('Unable count', error);
    });

  database.close();
});

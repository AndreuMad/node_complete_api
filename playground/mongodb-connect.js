const { MongoClient } = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/', (err, database) => {
  if(err) {
    console.log('Enable to connect to database');
    return;
  }

  console.log('Connected to MongoDB server');
  database.db('NodeCompleteApi').collection('todos').insertOne({
    text: 'Something to do',
    completed: false
  }, (err, result) => {
    if(err) {
      console.log('Unable to create TODO', err);
      return;
    }
    console.log(JSON.stringify(result.ops, null, 2));
  });
  database.close();
});

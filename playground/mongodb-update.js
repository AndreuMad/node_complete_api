const { MongoClient, ObjectID } = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/', (err, database) => {
  if (err) {
    console.log('Enable to connect to database');
    return;
  }

  console.log('Connected to MongoDB src');

  // deleteMany
  database.db('NodeCompleteApi').collection('todos')
    .findOneAndUpdate(
      { _id: ObjectID('5aa66875f9f620d564fd2ce2') },
      {
        $set: {
          completed: true
        },
        $inc: {
          time: 1
        }
      },
      {
        returnOriginal: false
      }
    )
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });

  // deleteOne
  // findOneAndDelete

  database.close();
});

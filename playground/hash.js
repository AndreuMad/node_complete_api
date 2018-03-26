const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const data = {
  id: 5
};
const password = '123456a';

// bcrypt.genSalt(10, (error, salt) => {
//   bcrypt.hash(password, salt, (error, hash) => {
//     console.log(hash);
//   });
// });

const hashedPassword = '$2a$10$liohJuHOvWCvZ2MXnaXmnuA.z6XPdS9iP.KYS8PppL3lD1QqtuQ8G';

bcrypt.compare(password, hashedPassword, (error, result) => {
  console.log(result);
});

const token = jwt.sign(data, 'abcdefg');

const verify = jwt.verify(token, 'abcdefg');

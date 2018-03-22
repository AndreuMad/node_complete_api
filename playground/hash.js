const jwt = require('jsonwebtoken');

const data = {
  id: 5
};

const token = jwt.sign(data, 'abcdefg');
console.log(token);

const verify = jwt.verify(token, 'abcdefg');
console.log(verify);

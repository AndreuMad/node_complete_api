const { ObjectID } = require('mongodb');
const { expect } = require('chai');
const request = require('supertest');

const app = require('../app');
const User = require('../features/users/models');

const {
  users,
  populateUsers
} = require('./seed/seed');

beforeEach(populateUsers);

describe('GET /users/profile', () => {

  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/profile')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).to.be.equal(users[0]._id.toHexString());
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/profile')
      .set('x-auth', `${users[0].tokens[0].token.slice(0, -1)}1`)
      .expect(401)
      .expect((res) => {
        expect(res.body).to.deep.equal({});
      })
      .end(done);
  });
});

describe('POST /users', () => {

  it('should create a user', (done) => {
    const email = 'example@example.com';
    const password = 123456;
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).to.exist;
        expect(res.body.user._id).to.exist;
        expect(res.body.user.email).to.be.equal(email);
      })
      .end((err) => {
        if (err) {
          return done(error);
        }

        return User.findOne({ email })
          .then((user) => {
            expect(user).to.exist;
            expect(user.password).to.not.equal(password);
            done();
          });
      });
  });

  it('should return validation errors if request is invalid', (done) => {
    const email = 'invalidEmail.com';
    const password = 12345;

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(500)
      .expect((res) => {
        expect(res.body.error).to.exist;
      })
      .end(done);
  });

  it('should not create user if email is in use', (done) => {
    const { email, password } = users[0];
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(500)
      .expect((res) => {
        expect(res.body.error).to.exist;
      })
      .end(done);
  });
});

describe('POST /users/login', () => {

  it('should login user and send a token', (done) => {
    const { email, password } = users[0];
    request(app)
      .post('/users/login')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).to.exist;
        expect(res.body.user.email).to.be.equal(email);
        expect(res.body.user._id).to.exist;
      })
      .end((error, res) => {
        if (error) {
          return done(error);
        }

        User.findById(users[0]._id)
          .then((user) => {
            expect(user.tokens[1]).to.include({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
  });

  it('should return 400 if password is invalid', (done) => {
    const { email, password } = users[0];
    request(app)
      .post('/users/login')
      .send({ email, password: `${password}1` })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).to.not.exist;
        expect(res.body.user).to.not.exist;
      })
      .end((error, res) => {
        if (error) {
          return done(error);
        }

        User.findById(users[0]._id)
          .then((user) => {
            expect(user.tokens[1]).to.not.exist;
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
  });
});

describe('DELETE /users/profile/token', () => {

  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/profile/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((error, res) => {
        if (error) {
          return done(error);
        }

        User.findById(users[0]._id)
          .then((user) => {
            expect(user.tokens[0]).to.not.deep.equal(users[0].tokens[0].token);
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
  });
});

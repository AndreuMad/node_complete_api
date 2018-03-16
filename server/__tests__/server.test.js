const { expect } = require('chai');
const request = require('supertest');

const { app } = require('../server');
const ToDo = require('../models/toDo');

const todos = [
  {
    text: 'First todo text'
  },
  {
    text: 'Second todo text'
  }
];

beforeEach((done) => {
  ToDo.remove({})
    .then(() => {
      return ToDo.insertMany(todos);
    })
    .then(() => {
      done();
    });
});

describe('POST/todos', function () {
  it('should create a new todo', (done) => {
    const text = 'abc';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).to.deep.equal(text);
      })
      .end((err, req) => {
        if (err) {
          return done(err);
        }

        ToDo.find({ text })
          .then((todos) => {
            expect(todos.length).to.be.equal(1);
            expect(todos[0].text).to.deep.equal(text);
            done();
          })
          .catch((err) => done(err));
      });
  });

  it('should not create ToDo with invalid body data', (done) => {
    const invalidText = 'text';

    request(app)
      .post('/todos')
      .send({ invalidText })
      .expect(400)
      .end((err, req) => {
        if (err) {
          return done(err);
        }

        ToDo.find()
          .then((todos) => {
            expect(todos.length).to.be.equal(2);
            done();
          })
          .catch((err) => {
            done(err);
          });
      })
  });
});

describe('GET/Todos', function () {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).to.be.equal(2);
      })
      .end(done);
  });
});

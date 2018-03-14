const { expect } = require('chai');
const request = require('supertest');

const { app } = require('../server');
const ToDo = require('../models/toDo');

beforeEach((done) => {
  ToDo.remove({})
    .then(() => {
      done();
    })
});

describe('POST/todos', () => {
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
});

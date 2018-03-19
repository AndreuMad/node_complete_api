const { ObjectID } = require('mongodb');
const { expect } = require('chai');
const request = require('supertest');

const { app } = require('../server');
const ToDo = require('../models/toDo');

const todos = [
  {
    _id: new ObjectID(),
    text: 'First todo text'
  },
  {
    _id: new ObjectID(),
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

describe('GET/todos', function () {
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

describe('GET/todos/:id', function () {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo).to.include({
          ...todos[0],
          _id: todos[0]._id.toLocaleString()
        });
      })
      .end(done);
  });

  it('should return 404 it todo is not founded', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if ObjectID is invalid', (done) => {
    request(app)
      .get('/todos/fakeObjectId123')
      .expect(404)
      .end(done);
  });
});

describe('PATCH/todos/:id', function () {
  it('should patch todo doc', (done) => {
    const hexId = todos[0]._id.toHexString();
    request(app)
      .patch(`/todos/${hexId}`)
      .send({ text: 'Updated text' })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).to.be.equal('Updated text');
      })
      .end(done);
  });

  it('should set completedAt field if todo is completed', (done) => {
    done();
  });
});

describe('DELETE/todos/:id', function () {
  it('should delete todo doc', (done) => {
    const hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).to.be.equal(hexId);
      })
      .end((error, res) => {
        if (error) {
          return done(error);
        }

        ToDo.findById(hexId)
          .then((todo) => {
            expect(todo).to.not.exist;
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
  });

  it('should delete a multiple todo docs', (done) => {
    const hexIds = `${todos[0]._id.toHexString()},${todos[1]._id.toHexString()}`;
    request(app)
      .delete(`/todos/${hexIds}?multiple=true`)
      .expect(200)
      .expect((res) => {
        expect(res.body).to.deep.equal({ n: 2, ok: 1 });
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if ObjectID is invalid', (done) => {
    const fakeId = 'fakeId';
    request(app)
      .delete(`/todos/${fakeId}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).to.be.equal(`Invalid ID: ${fakeId}`);
      })
      .end(done);
  });
});

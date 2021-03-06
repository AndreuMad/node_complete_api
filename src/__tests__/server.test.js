const { ObjectID } = require('mongodb');
const { expect } = require('chai');
const request = require('supertest');

const app = require('../app');
const ToDo = require('../features/toDos/models');
const {
  todos,
  populateTodos,
  users
} = require('./seed/seed');

beforeEach(populateTodos);

describe('POST /todos', function () {
  it('should create a new todo', (done) => {
    const text = 'abc';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body).to.include({
          text,
          _creator: users[0]._id.toLocaleString()
        });
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
      .set('x-auth', users[0].tokens[0].token)
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

describe('GET /todos', function () {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).to.be.equal(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', function () {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toLocaleString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo).to.include({
          ...todos[0],
          _id     : todos[0]._id.toLocaleString(),
          _creator: todos[0]._creator.toLocaleString()
        });
      })
      .end(done);
  });

  it('should not return todo doc created by another user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toLocaleString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 it todo is not founded', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toLocaleString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if ObjectID is invalid', (done) => {
    request(app)
      .get('/todos/fakeObjectId123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', function () {
  it('should patch todo doc', (done) => {
    const hexId = todos[0]._id.toLocaleString();
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({ text: 'Updated text' })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).to.be.equal('Updated text');
      })
      .end(done);
  });

  it('should not patch todo doc created by another user', (done) => {
    const hexId = todos[1]._id.toLocaleString();
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({ text: 'Updated text' })
      .expect(404)
      .end(done);
  });

  it('should set completedAt field if todo is completed', (done) => {
    const hexId = todos[0]._id.toLocaleString();
    const text = 'New text';
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text,
        completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).to.include({
          text,
          completed: true
        });
        expect(res.body.completedAt).to.be.a('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    const hexId = todos[0]._id.toLocaleString();
    const text = 'New text';
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text,
        completed: false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).to.include({
          text,
          completedAt: null
        });
      })
      .end(done);
  });
});

describe('DELETE /todos/:id', function () {
  it('should delete todo doc', (done) => {
    const hexId = todos[0]._id.toLocaleString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).to.be.equal(hexId);
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

  it('should not delete todo doc created by another user', (done) => {
    const hexId = todos[1]._id.toLocaleString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should delete a multiple todo docs', (done) => {
    const hexIds = `${todos[0]._id.toLocaleString()},${todos[1]._id.toLocaleString()}`;
    request(app)
      .delete(`/todos/${hexIds}?multiple=true`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body).to.deep.equal({ n: 1, ok: 1 });
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if ObjectID is invalid', (done) => {
    const fakeId = 'fakeId';
    request(app)
      .delete(`/todos/${fakeId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .expect((res) => {
        expect(res.body.error).to.be.equal(`Invalid ID: ${fakeId}`);
      })
      .end(done);
  });
});

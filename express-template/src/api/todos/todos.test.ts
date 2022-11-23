import request from 'supertest';

import app from '../../app';
import { client } from '../../db';
import { TodosCollection } from './todos.model';

beforeAll(async () => {
  try {
    await TodosCollection.drop();
  } catch (error) {
    // console.log('Error: ', error); // Uncomment for debugging
  }
});

afterAll(async () => {
  client.close();
});

describe('GET /api/v1/todos', () => {
  it('responds with an array of todos', (done) => {
    request(app)
      .get('/api/v1/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('length');
        expect(response.body.length).toBe(0);
        done();
      });
  });
});

describe('POST /api/v1/todos', () => {
  it('responds with an error if the todo is invalid', (done) => {
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({
        content: '',
        done: false,
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
        done();
      });
  });

  it('responds with an inserted object', (done) => {
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({
        content: 'Learn C++ Vectors',
        done: false,
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('content');
        expect(response.body.content).toEqual('Learn C++ Vectors');
        expect(response.body).toHaveProperty('done');
        done();
      });
  });
});

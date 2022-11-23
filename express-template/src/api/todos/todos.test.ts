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

import request from 'supertest';
import app from '../../app';
import { client } from '../../db';
import { UserCollection } from './user.model';

// Storing id to be used for fetching by ID in later tests
let id = '';

beforeAll(async () => {
  try {
    await UserCollection.drop();
  } catch (error) {
    // console.log('Error: ', error); // Uncomment for debugging
  }
});

afterAll(async () => {
  client.close();
});

describe('GET /api/v1/user', () => {
  it('responds with an array of user', (done) => {
    request(app)
      .get('/api/v1/user')
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
describe('GET /api/v1/user', () => {
  it('responds with an array of user', async () =>
    request(app)
      .get('/api/v1/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('length');
        expect(response.body.length).toBe(0);
      }));
});

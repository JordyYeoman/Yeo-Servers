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

describe('POST /api/v1/user', () => {
  it('responds with an error if the user is invalid', async () =>
    request(app)
      .post('/api/v1/user')
      .set('Accept', 'application/json')
      .send({
        name: 'Jordy Yeoman',
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
      }));
  it('responds with an inserted object', async () =>
    request(app)
      .post('/api/v1/user')
      .set('Accept', 'application/json')
      .send({
        name: 'Jordy Yeoman',
        age: 437,
        email: 'test@yeomanindustries.com.au',
        emailConfirmed: false,
        userType: 'admin',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        id = response.body._id;
        expect(response.body.age).toEqual(437);
        expect(response.body.email).toEqual('test@yeomanindustries.com.au');
        expect(response.body.userType).toEqual('admin');
      }));
  it('responds with an inserted object', async () =>
    request(app)
      .post('/api/v1/user')
      .set('Accept', 'application/json')
      .send({
        name: 'Jordy Yeoman',
        age: 437,
        email: 'test...yeomanindustries.com.au',
        emailConfirmed: false,
        userType: 'admin',
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toContain('Invalid email'); // Expect ZOD error for invalid email.
      }));
});

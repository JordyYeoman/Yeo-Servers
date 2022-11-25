import request from 'supertest';
import app from '../../app';
import { client } from '../../db';

// Storing id to be used for fetching by ID in later tests
let id = '';

// Test below should run all crud operations on a dummy user
afterAll(async () => {
  client.close();
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
  it('responds with a zod error for invalid object values', async () =>
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
  it('responds with an inserted object', async () =>
    request(app)
      .post('/api/v1/user')
      .set('Accept', 'application/json')
      .send({
        username: 'JSwizzle123',
        name: 'Jordy Yeoman',
        age: 437,
        email: 'test@yeomanindustries.com.au',
        password: 'testingBigDawg123',
        passwordConfirmation: 'testingBigDawg123',
        emailConfirmed: false,
        userType: 'admin',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        id = response.body._id; // Used for following tests
        expect(response.body.age).toEqual(437);
        expect(response.body.username).toEqual('JSwizzle123');
        expect(response.body.name).toEqual('Jordy Yeoman');
        expect(response.body.email).toEqual('test@yeomanindustries.com.au');
        expect(response.body.userType).toEqual('admin');
      }));
});

describe('GET /api/v1/user/:id', () => {
  it('responds with a single user', async () =>
    request(app)
      .get(`/api/v1/user/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        const { username, name, age, email, emailConfirmed, userType } =
          response.body;
        expect(response.body).toHaveProperty('_id');
        expect(name).toEqual('Jordy Yeoman');
        expect(username).toEqual('JSwizzle123');
        expect(age).toEqual(437);
        expect(email).toEqual('test@yeomanindustries.com.au');
        expect(emailConfirmed).toEqual(false);
        expect(userType).toEqual('admin');
      }));
  it('responds with an invalid ObjectId error', (done) => {
    request(app)
      .get('/api/v1/user/adsfadsfasdfasdf')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with a not found error', (done) => {
    request(app)
      .get('/api/v1/user/6306d061477bdb46f9c57fa4')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
  // Test passwords not matching
});

describe('PUT /api/v1/user/:id', () => {
  let dummyUser = {
    username: 'PPots123',
    name: 'Tony Stark',
    age: 42,
    email: 'tony.stark@starkindustries.com',
    emailConfirmed: true,
    password: 'tonyStarkHasAHeart123',
    passwordConfirmation: 'tonyStarkHasAHeart123',
    userType: 'admin',
  };

  it('responds with an invalid ObjectId error', (done) => {
    request(app)
      .put('/api/v1/user/adsfadsfasdfasdf')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with a not found error', (done) => {
    request(app)
      .put('/api/v1/user/6306d061477bdb46f9c57fa4')
      .set('Accept', 'application/json')
      .send(dummyUser)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
  it('responds with a single todo', async () =>
    request(app)
      .put(`/api/v1/user/${id}`)
      .set('Accept', 'application/json')
      .send(dummyUser)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        const { username, name, age, email, emailConfirmed, userType } =
          response.body;
        expect(response.body).toHaveProperty('_id');
        expect(username).toEqual('PPots123');
        expect(name).toEqual('Tony Stark');
        expect(age).toEqual(42);
        expect(email).toEqual('tony.stark@starkindustries.com');
        expect(emailConfirmed).toEqual(true);
        expect(userType).toEqual('admin');
      }));
});

// Remove dummy user that was created
describe('Delete /api/v1/user/:id', () => {
  it('responds with an invalid ObjectId error', (done) => {
    request(app)
      .delete('/api/v1/user/adsfadsfasdfasdf')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with a not found error', (done) => {
    request(app)
      .delete('/api/v1/user/6306d061477bdb46f9c57fa4')
      .set('Accept', 'application/json')
      .expect(404, done);
  });
  it('responds with a 204 status code', async () =>
    request(app).delete(`/api/v1/user/${id}`).expect(204));
  it('responds with a not found error', (done) => {
    request(app)
      .get(`/api/v1/user/${id}`)
      .set('Accept', 'application/json')
      .expect(404, done);
  });
});

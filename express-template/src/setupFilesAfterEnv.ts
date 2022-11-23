import { client } from './db';

// global.afterAll is executing before the unit tests finish running?
// Manually close connection to db after each test finishes?

// global.afterAll(async () => {
//   console.log('CLOSING SHIT');
//   client.close();
// });

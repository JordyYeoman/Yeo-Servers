// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { client } from './db';

// global.afterAll is executing before the unit tests finish running?
// Manually close connection to db after each test finishes?

// global.afterAll(async () => {
//   client.close();
// });

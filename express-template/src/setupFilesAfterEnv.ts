import { client } from './db';

global.afterAll(async () => {
  client.close();
});

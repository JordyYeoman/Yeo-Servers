import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes/routes';
import path from 'path';

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 9000;
const connectionEndpoint: string = process.env.CLOUD_CONNECTION_STRING ?? '';

mongoose.connect(connectionEndpoint, {
  dbName: process.env.DB_NAME
});
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('⚡️[server]: Database Online and ready sir.');
})

app.use(cors());
app.use(express.json());
app.use('/api', routes)

app.get('/', (req: Request, res: Response) => {
  // res.send('Welcome Legends.');
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is locked and loaded on Port:${port}`);
});
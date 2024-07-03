import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import checkToken from './authentication/auth.js';
import connect from './database/index.js';
import userRouter from './router/userRouter.js';
import marketRouter from './router/marketRouter.js';

config();

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.json());

app.use(cors());
app.use(checkToken);

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

app.get('/', (req, res) => {
  console.log('Getting api successfully');
  res.status(200).json({
    message: 'Getting api successfully',
  });
});

app.use('/user', userRouter);
app.use('/market', marketRouter);

app.listen(3003, async () => {
  await connect();
  console.log('Listening on port: http://localhost:3003');
});

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import httpStatus from 'http-status';

import routes from './app/routes/routes.js';
import globalErrorHandler from './app/middlewares/globalErrorHandler.js';
import { sendWhatsAppReminder } from '../reminderCall.js';

const app = express();

// const corsOptions = {
//   origin: true,
//   credentials: true,
// };

// app.use(cors());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // credentials: true,
  }),
);
app.options('*', cors());
app.use(cookieParser());

// parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// all routes
app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.send('Welcome to doctor management server !');
});
app.get('/test', async (req, res) => {
  await sendWhatsAppReminder("+8801633909408", "Jahid", "Dr. Jahid", "2025-08-25")
  res.send('Welcome to doctor management server !');
});

// global error handler
app.use(globalErrorHandler);

// handle not found routes
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: `Can't find ${req.originalUrl} on doctor management server!`,
    errorMessages: [
      {
        path: req.originalUrl,
        message: `Api not found!`,
      },
    ],
  });
  next();
});

export default app;

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { UserRouter } from './routes/user.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/auth', UserRouter);

mongoose.connect('mongodb://127.0.0.1:27017/authentication')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('DB error:', err));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import usersRoute from './routes/usersRoute';
import reportsRoute from './routes/reportsRoute';
import examsRoute from './routes/examsRoute';

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URI! || '')
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    throw err;
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', usersRoute);
app.use('/api/exams', examsRoute);
app.use('/api/reports', reportsRoute);

app.listen(port, () => {
  console.log(`now listening port ${port}`);
});

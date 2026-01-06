import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'Forum API - DT Node.js Internship Challenge',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      topics: '/api/topics',
      posts: '/api/posts'
    }
  });
});

app.use('/api/users', userRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/posts', postRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

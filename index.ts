import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import routes from './routes/index';
import adminRoutes from './routes/admin';

const app = express();
app.use(express.json());

// Serve frontend files from public folder
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/urlshortener');

app.use('/api', routes);
app.use('/admin', adminRoutes);

// Optional: retain a simple string for root or remove this to serve index.html by default
app.get('/', (_req, res) => {
  res.send('URL Shortener Service');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

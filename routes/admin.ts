import express from 'express';
import Url from '../models/Url';

const router = express.Router();

router.get('/all', async (_req, res) => {
  const urls = await Url.find();
  res.json(urls);
});

export default router;

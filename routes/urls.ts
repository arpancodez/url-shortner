import express from 'express';
import Url from '../models/Url';
import shortid from 'shortid';

const router = express.Router();

router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  const shortenUrlKey = shortid.generate();
  const url = new Url({ originalUrl, shortenUrlKey });
  await url.save();
  res.status(201).send({ shortenUrlKey });
});

router.get('/:shortenUrlKey', async (req, res) => {
  const { shortenUrlKey } = req.params;
  const record = await Url.findOne({ shortenUrlKey });
  if (!record) return res.status(404).send('Not found');
  res.redirect(record.originalUrl);
});

export default router;

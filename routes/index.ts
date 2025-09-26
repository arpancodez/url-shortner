import express from 'express';
import authRoutes from './auth';
import urlsRoutes from './urls';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/urls', urlsRoutes);

export default router;

import express from 'express';
import { getSpecials } from '../controllers/specialsController.js';
const router = express.Router();

router.get('/', getSpecials);

export default router; 
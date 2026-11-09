import express from 'express';
import { chat } from '../controllers/aicontroller.js';

const airouter = express.Router();

// POST /api/ai/chat
airouter.post('/chat', chat);

export default airouter;


import express from 'express';
import { LlamaController } from './llama.controller.js';

const router = express.Router();

router.post('/query', LlamaController.askQuestion);

export const LlamaRoutes = router;

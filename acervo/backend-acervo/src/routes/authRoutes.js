import express from 'express';
import { login } from '../controllers/authController.js';
import { zValidator } from '@anatine/zod-express-middleware';
import { loginSchema } from '../validators/authValidator.js';

const router = express.Router();
router.post(
  '/login',
  zValidator('body', loginSchema), // Validação do corpo da requisição
  login
);

export default router;

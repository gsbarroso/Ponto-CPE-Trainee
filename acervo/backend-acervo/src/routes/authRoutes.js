// src/routes/authRoutes.js
import { Router } from 'express';

import { 
  register, 
  login 
} from '../controllers/authController.js';

import { 
  registerValidator, 
  loginValidator 
} from '../validators/authValidator.js';

import { 
  validarRequisicao 
} from '../middlewares/validarRequisicao.js';

const router = Router();

// Rota para registro de usuário
router.post(
  '/registrar',
  registerValidator,
  validarRequisicao,
  register
);

// Rota para login
router.post(
  '/login',
  loginValidator,
  validarRequisicao,
  login
);

export default router;
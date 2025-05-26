// src/routes/authRoutes_corrigido.js
import { Router } from 'express';
import { register, login } from '../controllers/authController.js'; // Adicione .js se necessário
import { registerValidator, loginValidator } from '../validators/authValidator.js'; // Adicione .js se necessário

// Importe a função nomeada do arquivo corrigido
import { validarRequisicao } from '../middlewares/validarRequisicao.js';

const router = Router();

// Use o middleware importado corretamente
router.post('/registrar', registerValidator, validarRequisicao, register);
router.post('/login', loginValidator, validarRequisicao, login);

export default router;

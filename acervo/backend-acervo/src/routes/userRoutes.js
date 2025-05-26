import express from 'express';

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

import {
  validarCadastro,
  validarAtualizacao
} from '../validators/userValidator.js';

import { authenticate, authorize } from '../middlewares/authMiddlewares.js';
import { validarRequisicao } from '../middlewares/validarRequisicao.js';

const router = express.Router();

// Rotas públicas
router.post('/', validarCadastro, validarRequisicao, createUser);
router.get('/', getAllUsers);

// Middleware de autenticação para rotas abaixo
router.use(authenticate);

// Rotas protegidas
router.get('/:id', authorize('Admin', 'Gerente'), getUserById);
router.put('/:id', authorize('Admin'), validarAtualizacao, validarRequisicao, updateUser);
router.delete('/:id', authorize('Admin'), deleteUser);

export default router;

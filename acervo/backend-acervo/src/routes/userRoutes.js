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


import { validarRequisicao } from '../middlewares/validarRequisicao.js';

const router = express.Router();

// ROTAS PÚBLICAS
router.post(
  '/',
  validarCadastro,
  validarRequisicao,
  createUser
);

// Caso queira que listar todos os usuários seja pública (geralmente não é recomendado)
router.get(
  '/',
  getAllUsers
);

// ROTAS PROTEGIDAS (precisam de token válido)
router.get(
  '/:id',
  getUserById
);

router.put(
  '/:id',
  validarAtualizacao,
  validarRequisicao,
  updateUser
);

router.delete(
  '/:id',
  deleteUser
);

export default router;

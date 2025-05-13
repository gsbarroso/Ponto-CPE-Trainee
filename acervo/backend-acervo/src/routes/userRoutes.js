// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  createUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  validatePassword,
  updatePassword
} = require('../controllers/userController');

const { validarCadastro } = require('../validators/userValidator');
const autenticar = require('../middlewares/autenticacao');
const autorizar = require('../middlewares/autorizacao');

// ========== ROTAS PÚBLICAS ==========
router.post('/', validarCadastro, createUser);
router.get('/', listUsers); // Rota GET pública

// ========== MIDDLEWARE DE AUTENTICAÇÃO ==========
router.use(autenticar);

// ========== ROTAS AUTENTICADAS ==========
router.route('/:id')
  .get(autorizar('Admin', 'Gerente'), getUser)
  .put(autorizar('Admin'), updateUser)
  .delete(autorizar('Admin'), deleteUser);

router.patch('/:id/senha', 
  autorizar('Admin'), 
  validatePassword, 
  updatePassword
);

module.exports = router;
const express = require('express');
const router = express.Router();

const {
  createUser,
  getAllUsers,   // corrigido aqui
  getUserById,   // corrigido aqui
  updateUser,
  deleteUser,
  // validatePassword,  // Remova se não existir
  // updatePassword     // Remova se não existir
} = require('../controllers/userController');

const {
  validarCadastro,
  validarAtualizacao
} = require('../validators/userValidator');

const autenticar = require('../middlewares/autenticacao');
const autorizar = require('../middlewares/autorizacao');
const validarRequisicao = require('../middlewares/validarRequisicao');

// ========== ROTAS PÚBLICAS ==========
router.post('/', validarCadastro, validarRequisicao, createUser);
router.get('/', getAllUsers); // corrigido aqui

// ========== MIDDLEWARE DE AUTENTICAÇÃO ==========
router.use(autenticar);

// ========== ROTAS AUTENTICADAS ==========
router.get('/:id', autorizar('Admin', 'Gerente'), getUserById); // corrigido aqui
router.put('/:id', autorizar('Admin'), validarAtualizacao, validarRequisicao, updateUser);
router.delete('/:id', autorizar('Admin'), deleteUser);

// Se não implementou ainda, remova as rotas abaixo para evitar erro
// router.patch('/:id/senha',
//   autorizar('Admin'),
//   validatePassword,
//   updatePassword
// );

module.exports = router;

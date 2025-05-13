const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validarCadastroUsuario } = require('../validators/userValidator');
const autenticar = require('../middlewares/autenticacao'); // Caminho corrigido
const autorizar = require('../middlewares/autorizacao');

// Rotas públicas
router.post('/registrar', validarCadastroUsuario, userController.criarUsuario);

// Rotas autenticadas
router.use(autenticar);

// Rotas com controle de acesso
router.get('/', 
  autorizar('Admin'), 
  userController.listarUsuarios
);

router.route('/:id')
  .get(autorizar('Admin', 'Gerente'), userController.obterUsuario)
  .put(autorizar('Admin'), userController.atualizarUsuario)
  .delete(autorizar('Admin'), userController.removerUsuario);

// Rota especial para mudança de senha
router.patch('/:id/senha',
  autorizar('Admin'),
  userController.validarTrocaSenha,
  userController.atualizarSenha
);

module.exports = router;
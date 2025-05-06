const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rotas para usuários
router.post('/', userController.createUser);       // POST /usuarios - Cria usuário
router.get('/', userController.getUsers);          // GET /usuarios - Lista todos
router.get('/:id', userController.getUserById);    // GET /usuarios/:id - Busca por ID
router.put('/:id', userController.updateUser);     // PUT /usuarios/:id - Atualiza
router.delete('/:id', userController.deleteUser);  // DELETE /usuarios/:id - Remove

module.exports = router;
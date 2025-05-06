const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateUser = require('../validators/userValidator');

// Middleware de validação
function validate(req, res, next) {
  const errors = validateUser(req.body);
  if (errors.length) return res.status(400).json({ errors });
  next();
}

// Rotas (sem repetir "/users" no caminho, pois o prefixo já é aplicado no server.js)
router.post('/', validate, userController.createUser);       // POST /usuarios
router.get('/', userController.getUsers);                    // GET /usuarios
router.get('/:id', userController.getUserById);              // GET /usuarios/:id
router.put('/:id', validate, userController.updateUser);     // PUT /usuarios/:id
router.delete('/:id', userController.deleteUser);            // DELETE /usuarios/:id

module.exports = router;
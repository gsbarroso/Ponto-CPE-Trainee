const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Chave secreta para gerar o token
const SECRET = 'seusegredoaqui';

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios!' });
  }

  try {
    const user = await User.findOne({ email, senha }); // Atenção: SEM criptografia nesse exemplo.

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });

    return res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      token
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
  }
});

module.exports = router;

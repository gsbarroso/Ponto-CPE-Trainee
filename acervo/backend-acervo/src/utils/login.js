const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Chave secreta para gerar o token (idealmente coloque isso em variáveis de ambiente)
const SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      success: false,
      message: 'Email e senha são obrigatórios!'
    });
  }

  try {
    // Buscar usuário pelo email (e trazer a senha que está oculta por padrão)
    const user = await User.findOne({ email }).select('+senha');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos.'
      });
    }

    // Verificar se a senha está correta
    const senhaCorreta = await bcrypt.compare(senhaDigitada, senhaCorreta);

    if (!senhaCorreta) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos.'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id_usuario,
        nome: user.nome,
        email: user.email,
        cargo: user.cargo
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno no servidor.'
    });
  }
});

module.exports = router;

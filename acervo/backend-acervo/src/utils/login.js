const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Ideal: colocar a SECRET em variáveis de ambiente (.env)
const SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      success: false,
      code: 'MISSING_FIELDS',
      message: 'Email e senha são obrigatórios.'
    });
  }

  try {
    // Buscar usuário pelo email, incluindo a senha (select: false no model)
    const user = await User.findOne({ email }).select('+senha');

    if (!user) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Email ou senha inválidos.'
      });
    }

    // Verificar se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Email ou senha inválidos.'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, cargo: user.cargo },
      SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
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
    console.error('🚨 Erro no login:', error);
    return res.status(500).json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Erro interno no servidor.'
    });
  }
});

router.post('/logout', (req, res) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      message: 'Token não fornecido.' 
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Formato de token inválido.' 
    });
  }

  try {
    // Adicionar token à blacklist
    revokeToken(token);
    
    return res.status(200).json({ 
      success: true,
      message: 'Logout realizado com sucesso!' 
    });
  } catch (error) {
    console.error('🚨 Erro no logout:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erro interno no servidor.' 
    });
  }
});

export default router;
module.exports = router;

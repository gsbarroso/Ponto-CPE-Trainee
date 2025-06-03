const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Rota de cadastro
router.post('/cadastrar', async (req, res) => {
  const { nome, email, senha, cargo } = req.body;

  if (!nome || !email || !senha || !cargo) {
    return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
  }

  try {
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ success: false, message: 'Email já cadastrado' });
    }

    const hashSenha = await bcrypt.hash(senha, 10);

    const novoUsuario = await User.create({
      nome,
      email,
      senha: hashSenha,
      cargo
    });

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      user: {
        id: novoUsuario.id_usuario,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        cargo: novoUsuario.cargo
      }
    });

  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

module.exports = router;

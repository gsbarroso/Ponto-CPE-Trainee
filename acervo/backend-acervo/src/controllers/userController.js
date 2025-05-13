const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Criação de usuário
exports.createUser = async (req, res) => {
  try {
    const { nome, cargo, email, senha, nivel_acesso } = req.body;

    // Validação de campos obrigatórios
    if (!nome || !cargo || !email || !senha) {
      return res.status(400).json({
        status: 'error',
        message: 'Nome, cargo, email e senha são obrigatórios'
      });
    }

    const novoUsuario = await User.create({
      nome,
      cargo,
      email,
      senha,
      nivel_acesso
    });

    res.status(201).json({
      status: 'success',
      data: {
        _id: novoUsuario._id,
        nome: novoUsuario.nome,
        cargo: novoUsuario.cargo,
        email: novoUsuario.email,
        nivel_acesso: novoUsuario.nivel_acesso,
        createdAt: novoUsuario.createdAt
      }
    });

  } catch (error) {
    let message = 'Erro ao criar usuário';
    if (error.name === 'ValidationError') {
      message = Object.values(error.errors).map(val => val.message).join(', ');
    } else if (error.code === 11000) {
      message = 'Email já está em uso';
    }
    res.status(400).json({ status: 'error', message });
  }
};

// Atualização de usuário
exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    
    if (updates.senha) {
      updates.senha = await bcrypt.hash(updates.senha, 10);
    }

    const usuarioAtualizado = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, select: '-senha -__v' }
    ).lean();

    if (!usuarioAtualizado) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: usuarioAtualizado
    });

  } catch (error) {
    let message = 'Erro ao atualizar usuário';
    if (error.name === 'ValidationError') {
      message = Object.values(error.errors).map(val => val.message).join(', ');
    }
    res.status(400).json({ status: 'error', message });
  }
};

// Listagem de usuários
exports.listUsers = async (req, res) => {
  try {
    const usuarios = await User.find()
      .select('-senha -__v')
      .lean();

    res.status(200).json({
      status: 'success',
      results: usuarios.length,
      data: usuarios
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar usuários'
    });
  }
};

// Busca de usuário específico
exports.getUser = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id)
      .select('-senha -__v')
      .lean();

    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: usuario
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar usuário'
    });
  }
};

// Validação de senha
exports.validatePassword = async (req, res, next) => {
  try {
    const { senhaAtual } = req.body;
    const usuario = await User.findById(req.params.id).select('+senha');
    
    if (!usuario) return res.status(404).json({
      status: 'error',
      message: 'Usuário não encontrado'
    });
    
    const senhaValida = await usuario.compareSenha(senhaAtual);
    if (!senhaValida) return res.status(401).json({
      status: 'error',
      message: 'Senha atual incorreta'
    });
    
    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro na validação da senha'
    });
  }
};

// Atualização de senha
exports.updatePassword = async (req, res) => {
  try {
    const { novaSenha } = req.body;
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    
    await User.findByIdAndUpdate(
      req.params.id,
      { senha: senhaHash }
    );

    res.status(200).json({
      status: 'success',
      message: 'Senha atualizada com sucesso'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Erro ao atualizar senha'
    });
  }
};

// Adicione este método ao controller
exports.deleteUser = async (req, res) => {
  try {
    const usuario = await User.findByIdAndDelete(req.params.id)
      .select('-senha -__v');

    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Usuário removido com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao remover usuário'
    });
  }
};
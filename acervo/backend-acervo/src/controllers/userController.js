const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Cria um novo usuário (MongoDB)
 * Método: POST
 * Rota: /usuarios
 */
exports.createUser = async (req, res) => {
  try {
    const { nome, cargo, email, senha, nivel } = req.body;

    // Salva a senha original temporariamente
    const senhaOriginal = senha;

    // Cria e salva o usuário (a senha será hasheada automaticamente)
    const user = new User({ nome, cargo, email, senha, nivel });
    await user.save();

    // Monta a resposta manualmente
    const responseUser = {
      _id: user._id,
      nome: user.nome,
      cargo: user.cargo,
      email: user.email,
      senha: senhaOriginal, // Senha original não codificada
      nivel: user.nivel,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(201).json(responseUser);
  } catch (err) {
    console.error('Erro no POST /usuarios:', err);
    if (err.code === 11000) {
      res.status(400).json({ error: 'Este email já está registrado' });
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

/**
 * Retorna todos os usuários (MongoDB)
 * Método: GET
 * Rota: /usuarios
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v'); // Inclui o campo senha
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

/**
 * Atualiza um usuário por ID (MongoDB)
 * Método: PUT
 * Rota: /usuarios/:id
 */
exports.updateUser = async (req, res) => {
  try {
    // Se a senha for fornecida, hash antes de atualizar
    if (req.body.senha) {
      req.body.senha = await bcrypt.hash(req.body.senha, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, select: '-__v' } // Não retornar versão do documento
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Este email já está registrado' });
    }
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Deleta um usuário por ID (MongoDB)
 * Método: DELETE
 * Rota: /usuarios/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};
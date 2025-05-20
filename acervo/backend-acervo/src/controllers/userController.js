const bcrypt = require("bcrypt");
const User = require("../models/User");

// Criar usuário (POST)
const createUser = async (req, res) => {
  try {
    const { nome, email, senha, nivel_acesso } = req.body;

    const user = new User({
      nome,
      email,
      senha, // será hasheada no pre-save
      nivel_acesso: Boolean(nivel_acesso),
    });

    await user.save();

    // Retorna a senha em texto puro (a que veio no req.body)
    res.status(201).json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      senha: senha, // texto puro
      nivel_acesso: user.nivel_acesso,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar todos os usuários (GET)
const getAllUsers = async (req, res) => {
  try {
    // Seleciona a senha hashada (sem "-senha")
    const users = await User.find().select("+senha");

    const response = users.map(user => ({
      id: user._id,
      nome: user.nome,
      email: user.email,
      senha: user.senha, // senha hashada
      nivel_acesso: user.nivel_acesso,
      createdAt: user.createdAt,
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar usuário por ID (GET /:id)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Seleciona a senha hashada
    const user = await User.findById(id).select("+senha");
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      senha: user.senha, // senha hashada
      nivel_acesso: user.nivel_acesso,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar usuário (PUT /:id)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, nivel_acesso } = req.body;

    // Buscar usuário com senha para possível re-hash
    const user = await User.findById(id).select("+senha");
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    // Atualiza campos
    user.nome = nome ?? user.nome;
    user.email = email ?? user.email;
    if (senha) {
      user.senha = senha; // será hash no pre-save
    }
    if (nivel_acesso !== undefined) {
      user.nivel_acesso = Boolean(nivel_acesso);
    }

    await user.save();

    // Retorna a senha em texto puro (a que veio no req.body)
    res.json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      senha: senha || undefined, // texto puro se senha foi enviada na atualização
      nivel_acesso: user.nivel_acesso,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deletar usuário (DELETE /:id)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    await user.deleteOne();

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

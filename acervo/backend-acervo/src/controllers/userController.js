import User from "../models/User.js";

// Criar usuário (POST)
export const createUser = async (req, res) => {
  try {
    const { nome, email, senha, nivel_acesso } = req.body;

    const user = new User({
      nome,
      email,
      senha,
      nivel_acesso: Boolean(nivel_acesso),
    });

    await user.save();

    res.status(201).json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      nivel_acesso: user.nivel_acesso,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar todos os usuários (GET)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("+senha");

    const response = users.map(user => ({
      id: user._id,
      nome: user.nome,
      email: user.email,
      nivel_acesso: user.nivel_acesso,
      createdAt: user.createdAt,
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar usuário por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("+senha");
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      nivel_acesso: user.nivel_acesso,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar usuário
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, nivel_acesso } = req.body;

    const user = await User.findById(id).select("+senha");
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    user.nome = nome ?? user.nome;
    user.email = email ?? user.email;

    if (nivel_acesso !== undefined) {
      user.nivel_acesso = Boolean(nivel_acesso);
    }

    await user.save();

    res.json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      nivel_acesso: user.nivel_acesso,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deletar usuário
// Deletar usuário
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    await user.deleteOne();

    res.status(200).json({ message: `Usuário id: ${id} deletado com sucesso` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


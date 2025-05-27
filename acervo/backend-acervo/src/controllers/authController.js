import User from '../models/User.js';
import { generateToken } from '../config/authService.js';

export const register = async (req, res) => {
  try {
    const { nome, email, cargo, senha } = req.body;

    // Validação básica dos campos para evitar lixo no banco
    if (!nome || !email || !cargo || !senha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Usuário com esse email já está cadastrado.' });
    }

    // Criar usuário (assumindo que o hash da senha é tratado no model)
    const user = await User.create({ nome, email, cargo, senha });

    // Gerar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      cargo: user.cargo
    });

    res.status(201).json({ 
      token, 
      user: { id: user.id, nome: user.nome, email: user.email, cargo: user.cargo }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    // Buscar usuário pelo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(senha);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    // Gerar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      cargo: user.cargo
    });

    res.json({ 
      token, 
      user: { id: user.id, nome: user.nome, email: user.email, cargo: user.cargo }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

import User from '../models/User.js';
import { generateToken } from '../config/auth.config.js';

export const register = async (req, res) => {
  try {
    const { nome, email, cargo, senha } = req.body;
    const user = await User.create({ nome, email, cargo, senha });
    
    const token = generateToken({
      id: user.id,
      email: user.email,
      cargo: user.cargo
    });
    
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(senha))) {
      throw new Error('Credenciais inválidas');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      cargo: user.cargo
    });

    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
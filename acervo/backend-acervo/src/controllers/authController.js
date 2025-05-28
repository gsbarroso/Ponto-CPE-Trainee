import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'Email e senha são obrigatórios.'
      });
    }

    const user = await User.findOne({ email }).select('+senha');
    if (!user) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Email ou senha inválidos.'
      });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Email ou senha inválidos.'
      });
    }

    const token = jwt.sign(
      { id: user._id, nivel_acesso: user.nivel_acesso },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      success: true,
      code: 'LOGIN_SUCCESS',
      message: 'Login realizado com sucesso.',
      token
    });

  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Erro interno no servidor.'
    });
  }
};

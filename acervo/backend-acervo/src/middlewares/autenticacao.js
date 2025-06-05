import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

// Blacklist em memória (para desenvolvimento)
const tokenBlacklist = new Set();

// Função para limpeza periódica de tokens expirados
const startTokenCleanup = () => {
  setInterval(() => {
    tokenBlacklist.forEach(token => {
      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp < Date.now() / 1000) {
          tokenBlacklist.delete(token);
        }
      } catch {
        tokenBlacklist.delete(token);
      }
    });
  }, 3600000); // A cada hora
};

// Inicia a limpeza automática
startTokenCleanup();

export const autenticar = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false,
      message: 'Token não fornecido.' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificar se o token está na blacklist
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ 
        success: false,
        message: 'Sessão inválida. Faça login novamente.' 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (err) {
    let message = 'Token inválido';
    
    if (err.name === 'TokenExpiredError') {
      message = 'Token expirado';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Token inválido';
    }
    
    res.status(401).json({ 
      success: false,
      message 
    });
  }
};

// Função para adicionar token à blacklist (usar na rota de logout)
export const revokeToken = (token) => {
  tokenBlacklist.add(token);
};
// middlewares/auth.js
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';
import { JWT_SECRET } from '../config/config.js';

export const autenticar = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Token não fornecido.' 
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar blacklist
    const isRevoked = await redisClient.get(`revoked:${token}`);
    if (isRevoked) {
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
    let message = 'Token inválido ou expirado.';
    
    if (err.name === 'TokenExpiredError') {
      message = 'Token expirado.';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Token inválido.';
    }

    res.status(401).json({ 
      success: false,
      message 
    });
  }
};
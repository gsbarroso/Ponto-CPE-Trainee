// routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js'; // Importe o cliente Redis
import { JWT_SECRET } from '../config/config.js';

const router = express.Router();

router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Token não fornecido.' 
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Formato de token inválido.' 
      });
    }

    // Decodificar o token sem verificar a expiração
    const decoded = jwt.decode(token);
    
    if (!decoded) {
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido.' 
      });
    }

    // Verificar manualmente a assinatura (ignorando expiração)
    try {
      jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    } catch (error) {
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido.' 
      });
    }

    // Calcular tempo de expiração restante
    const now = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp ? Math.max(0, decoded.exp - now) : 3600;

    // Adicionar à blacklist (Redis)
    await redisClient.set(`revoked:${token}`, 'true', 'EX', ttl);

    return res.status(200).json({ 
      success: true,
      message: 'Logout realizado com sucesso!' 
    });

  } catch (error) {
    console.error('🚨 Erro no logout:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erro interno no servidor.' 
    });
  }
});

export default router;
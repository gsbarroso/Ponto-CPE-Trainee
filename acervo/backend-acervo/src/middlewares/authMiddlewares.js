import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth.config.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Formato do token inválido. Use: Bearer <token>' });
    }

    // jwt.verify não é async, então usamos a versão síncrona com try/catch
    const decoded = jwt.verify(token, JWT_SECRET);

    // Validar payload mínimo esperado
    if (!decoded.id || !decoded.cargo) {
      return res.status(401).json({ error: 'Payload do token inválido' });
    }

    req.user = decoded; // passa o decoded para as próximas rotas
    next();

  } catch (error) {
    console.error('Erro na autenticação:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado' });
    }

    return res.status(401).json({ error: 'Token inválido ou malformado' });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    if (!allowedRoles.includes(req.user.cargo)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }
    next();
  };
};

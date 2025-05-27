import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js'; // Ajuste o caminho conforme sua estrutura
import { JWT_SECRET } from '../config/authConfig.js';

/**
 * Middleware de autenticação via JWT
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      code: 'TOKEN_REQUIRED',
      message: 'Token de autenticação não fornecido.',
    });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      success: false,
      code: 'INVALID_TOKEN_FORMAT',
      message: 'Formato do token inválido. Use: Bearer <token>.',
    });
  }

  if (!JWT_SECRET) {
    logger.error('Erro crítico: JWT_SECRET não definido.');
    return res.status(500).json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Configuração de segurança ausente no servidor.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.id || !decoded.cargo) {
      logger.warn(`Payload do token inválido: ${JSON.stringify(decoded)}`);
      return res.status(401).json({
        success: false,
        code: 'INVALID_TOKEN_PAYLOAD',
        message: 'Payload do token inválido ou incompleto.',
      });
    }

    req.user = {
      id: decoded.id,
      cargo: decoded.cargo,
      email: decoded.email, // opcional, se estiver no payload
    };

    next();
  } catch (error) {
    let statusCode = 401;
    let errorCode = 'AUTH_FAILED';
    let errorMessage = 'Falha na autenticação.';

    if (error instanceof jwt.TokenExpiredError) {
      errorCode = 'TOKEN_EXPIRED';
      errorMessage = 'Token expirado.';
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorCode = 'INVALID_TOKEN';
      errorMessage = 'Token inválido ou malformado.';
      logger.warn(`JsonWebTokenError: ${error.message} (Token: ${token ? token.slice(0, 10) + '...' : 'N/A'})`);
    } else {
      statusCode = 500;
      errorCode = 'INTERNAL_AUTH_ERROR';
      errorMessage = 'Erro interno durante a autenticação.';
      logger.error(`Erro inesperado na autenticação [${errorCode}]:`, error);
    }

    logger.error(`Falha na autenticação [${errorCode}]: ${errorMessage} (Erro: ${error.message})`);

    return res.status(statusCode).json({
      success: false,
      code: errorCode,
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Middleware de autorização baseado no cargo do usuário
 * @param {Array<string>} allowedRoles - Lista de cargos permitidos
 */
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.cargo) {
      return res.status(403).json({
        success: false,
        code: 'ACCESS_DENIED',
        message: 'Acesso negado. Usuário não autenticado corretamente.',
      });
    }

    if (!allowedRoles.includes(req.user.cargo)) {
      return res.status(403).json({
        success: false,
        code: 'FORBIDDEN',
        message: 'Você não tem permissão para acessar este recurso.',
      });
    }

    next();
  };
};

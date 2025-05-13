// src/middlewares/autenticacao.js
const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
  try {
    // 1. Verificar existência do header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_REQUIRED',
        message: 'Token de autenticação não fornecido'
      });
    }

    // 2. Validar formato do token (Bearer + token)
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_TOKEN_FORMAT',
        message: 'Formato do token inválido. Use: Bearer <token>'
      });
    }

    // 3. Verificar token com tratamento de erros específicos
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Validar estrutura do payload
    if (!decoded.id || !decoded.cargo) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_TOKEN_PAYLOAD',
        message: 'Payload do token inválido'
      });
    }

    // 5. Adicionar dados ao request
    req.usuario = {
      id: decoded.id,
      cargo: decoded.cargo,
      token // Útil para logout/revogação
    };

    next();
    
  } catch (error) {
    // 6. Tratamento detalhado de erros
    let statusCode = 401;
    let errorCode = 'AUTH_FAILED';
    let errorMessage = 'Falha na autenticação';

    if (error instanceof jwt.TokenExpiredError) {
      statusCode = 403;
      errorCode = 'TOKEN_EXPIRED';
      errorMessage = 'Token expirado';
    }

    if (error instanceof jwt.JsonWebTokenError) {
      errorCode = 'INVALID_TOKEN';
      errorMessage = 'Token inválido ou malformado';
    }

    console.error(`Erro de autenticação [${errorCode}]:`, error.message);
    
    return res.status(statusCode).json({
      success: false,
      code: errorCode,
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = autenticar;
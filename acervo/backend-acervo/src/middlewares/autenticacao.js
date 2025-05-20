const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
  try {
    // 1. Verifica se existe o header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_REQUIRED',
        message: 'Token de autenticação não fornecido'
      });
    }

    // 2. Valida o formato: deve ser "Bearer <token>"
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_TOKEN_FORMAT',
        message: 'Formato do token inválido. Use: Bearer <token>'
      });
    }

    // 3. Verifica o token (jwt.verify lança erro se inválido ou expirado)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Valida payload esperado
    if (!decoded.id || !decoded.cargo) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_TOKEN_PAYLOAD',
        message: 'Payload do token inválido'
      });
    }

    // 5. Adiciona dados do usuário ao req para as próximas etapas
    req.usuario = {
      id: decoded.id,
      cargo: decoded.cargo,
      token, // pode ser útil para logout/revogação se quiser implementar
    };

    next();

  } catch (error) {
    // 6. Tratamento dos erros específicos
    let statusCode = 401;
    let errorCode = 'AUTH_FAILED';
    let errorMessage = 'Falha na autenticação';

    if (error.name === 'TokenExpiredError') {
      statusCode = 403;
      errorCode = 'TOKEN_EXPIRED';
      errorMessage = 'Token expirado';
    } else if (error.name === 'JsonWebTokenError') {
      errorCode = 'INVALID_TOKEN';
      errorMessage = 'Token inválido ou malformado';
    }

    console.error(`Erro de autenticação [${errorCode}]:`, error.message);

    return res.status(statusCode).json({
      success: false,
      code: errorCode,
      message: errorMessage,
      // Se estiver em dev, mostrar detalhes do erro ajuda debug
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = autenticar;

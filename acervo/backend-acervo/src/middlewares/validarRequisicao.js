// src/middlewares/validarRequisicao.js
import { validationResult } from 'express-validator';

export const validarRequisicao = (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    // Retorna um objeto com a chave 'errors' para consistência com o erro de token
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Erro de validação nos dados da requisição.',
      errors: erros.array() // Mantém os detalhes dos erros de validação
    });
  }
  next();
};

// Exportação padrão pode ser útil se este for o único export do arquivo
// export default validarRequisicao;
// Mas manteremos a exportação nomeada por consistência com authMiddlewares

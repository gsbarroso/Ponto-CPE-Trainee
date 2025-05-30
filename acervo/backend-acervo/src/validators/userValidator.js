import { body } from 'express-validator';
import User from '../models/User.js'; // Note o .js e uso de import

export const validarCadastro = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email é obrigatório')
    .isEmail().withMessage('Email inválido')
    .custom(async email => {
      const user = await User.findOne({ email });
      if (user) throw new Error('Email já cadastrado');
      return true;
    }),

  body('cargo')
    .trim()
    .notEmpty().withMessage('Cargo é obrigatório'),

  body('senha')
    .trim()
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),

  body('nivel')
    .isBoolean().withMessage('Nível deve ser booleano')
];

export const validarAtualizacao = [
  body('email')
    .optional()
    .isEmail().withMessage('Email inválido')
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.params.id) {
        throw new Error('Email já cadastrado');
      }
      return true;
    }),

  body('senha')
    .optional()
    .isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres') // Corrigi a msg para 6 caracteres
];

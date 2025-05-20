// src/validators/authValidator.js
import { body } from 'express-validator';

export const registerValidator = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('cargo').notEmpty().withMessage('Cargo é obrigatório'),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('confirmacaoSenha').custom((value, { req }) => {
    if (value !== req.body.senha) throw new Error('Senhas não coincidem');
    return true;
  })
];

export const loginValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').notEmpty().withMessage('Senha é obrigatória')
];

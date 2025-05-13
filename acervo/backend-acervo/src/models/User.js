const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  id_usuario: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true
  },
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    trim: true,
    minlength: [3, 'Nome deve ter pelo menos 3 caracteres']
  },
  cargo: {
    type: String,
    required: [true, 'O cargo é obrigatório'],
    enum: ['Desenvolvedor', 'Gerente', 'Admin'],
    default: 'Desenvolvedor'
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'O email é obrigatório'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido'],
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: [true, 'A senha é obrigatória'],
    minlength: [8, 'Senha deve ter no mínimo 8 caracteres'],
    select: false // Não retorna a senha em consultas
  },
  nivel_acesso: {
    type: String,
    enum: ['basico', 'intermediario', 'avancado'],
    default: 'basico'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.senha;
      delete ret.__v;
      return ret;
    }
  }
});

// Middleware de pré-save aprimorado
userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(new Error('Falha ao criptografar senha'));
  }
});

// Método de comparação de senhas com tratamento de erros
userSchema.methods.compareSenha = async function(senhaCandidata) {
  try {
    return await bcrypt.compare(senhaCandidata, this.senha);
  } catch (error) {
    throw new Error('Falha na comparação de senhas');
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
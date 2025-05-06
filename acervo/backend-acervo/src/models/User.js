const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  id_usuario: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true // Adicionado índice para otimizar consultas
  },
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    trim: true // Remove espaços em branco extras
  },
  cargo: {
    type: String,
    required: [true, 'O cargo é obrigatório'],
    enum: ['Desenvolvedor', 'Gerente', 'Admin'], // Exemplo de valores permitidos
    default: 'Desenvolvedor'
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'O email é obrigatório'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido'],
    lowercase: true, // Armazena em lowercase
    trim: true
  },
  senha: {
    type: String,
    required: true,
    select: false // Oculta a senha por padrão
  },
  nivel: {
    type: Boolean,
    required: [true, 'O nível de acesso é obrigatório'],
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id_usuario; // Remove campo
      delete ret.id;         // Remove campo
      delete ret.__v;        // Remove versão do documento
      return ret;
    }
  }
});

// Middleware para criptografia da senha
userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.senha);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
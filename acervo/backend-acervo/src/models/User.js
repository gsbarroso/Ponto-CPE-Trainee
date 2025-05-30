import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

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
    minlength: [6, 'A senha deve ter pelo menos 6 caracteres'],
    select: false // Segurança: não retorna senha nas queries por padrão
  },
  nivel_acesso: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash da senha antes de salvar (apenas se for nova ou modificada)
userSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// Método de instância para comparar senhas
userSchema.methods.compareSenha = async function (senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

// Método estático de login
userSchema.statics.login = async function (email, senha) {
  const user = await this.findOne({ email }).select('+senha');
  if (!user) {
    throw new Error('Email ou senha inválidos');
  }

  const senhaCorreta = await user.compareSenha(senha);
  if (!senhaCorreta) {
    throw new Error('Email ou senha inválidos');
  }

  return user;
};

const User = mongoose.model('User', userSchema);
export default User;

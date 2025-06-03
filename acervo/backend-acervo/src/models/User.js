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
    select: false
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

// 🔐 Hash da senha antes de salvar
userSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

// 🔍 Método de comparação de senha
userSchema.methods.compararSenha = async function (senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

const User = mongoose.model('User', userSchema);
export default User;

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // Faz o ID ser sequencial
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nivel: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  tableName: 'usuarios',  // Nome da tabela no banco de dados
  timestamps: true,  // Se você quiser usar createdAt e updatedAt
  hooks: {
    // Não há mais criptografia no POST
  },
});

// Método para criptografar a senha apenas quando necessário
User.prototype.hashPassword = async function () {
  if (this.senha) {
    this.senha = await bcrypt.hash(this.senha, 10);
  }
};

// Adicionando o método de validação de senha à instância do modelo
User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.senha); // Comparação segura
};

module.exports = User;

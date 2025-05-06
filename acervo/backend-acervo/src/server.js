// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sequelize = require('./config/database'); // Caminho corrigido
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());

// Rotas
app.use('/usuarios', userRoutes);

// Conexão com o banco de dados
sequelize.sync()
  .then(() => {
    console.log('Banco conectado com sucesso!');
  })
  .catch(err => {
    console.error('Erro ao conectar no banco:', err);
  });

module.exports = app;
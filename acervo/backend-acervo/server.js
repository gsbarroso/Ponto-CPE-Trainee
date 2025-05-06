const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/userRoutes');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middleware para JSON
app.use(express.json());

// Rotas
app.use('/usuarios', userRoutes);

// Rota principal GET
app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

// Middleware para capturar rotas não encontradas (404)
app.use((req, res, next) => {
  res.status(404).send('Página não encontrada!');
});

// Middleware para capturar erros gerais
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ocorreu um erro no servidor!');
});

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000, // 30 segundos
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ Conectado ao MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro de conexão:', err);
    process.exit(1);
  });

module.exports = app;
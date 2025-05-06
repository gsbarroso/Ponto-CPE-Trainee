const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/userRoutes');

// Carregar variáveis de ambiente
dotenv.config();

// Configurar conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ Conectado ao MongoDB');
  })
  .catch(err => {
    console.error('❌ Erro de conexão:', err);
    process.exit(1);
  });

const app = express();

// Middleware para JSON
app.use(express.json());

// Rotas
app.use('/usuarios', userRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

// Middleware para 404
app.use((req, res) => {
  res.status(404).send('Página não encontrada!');
});

// Middleware para erros
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Erro interno do servidor!');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

module.exports = app;
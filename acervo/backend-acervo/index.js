const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./src/routes/userRoutes');
const logger = require('./src/utils/logger');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// ======================================
// CONFIGURAÇÕES DE SEGURANÇA
// ======================================
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ======================================
// PROTEÇÃO CONTRA DDoS E ABUSOS
// ======================================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});

// ======================================
// MIDDLEWARES
// ======================================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ======================================
// CONEXÃO COM BANCO DE DADOS
// ======================================
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI não definida no .env');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });

    logger.info('✅ Conectado ao MongoDB');

    mongoose.connection.on('error', err => {
      logger.error(`❌ Erro de conexão: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  Desconectado do MongoDB');
    });

  } catch (err) {
    logger.error(`❌ Falha na conexão: ${err.message}`);
    process.exit(1);
  }
};

// ======================================
// ROTAS PRINCIPAIS
// ======================================
app.use('/api/v1/usuarios', apiLimiter, userRoutes); // Rota corrigida

// ======================================
// HEALTH CHECK
// ======================================
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Servidor operacional',
    timestamp: new Date().toISOString()
  });
});

// ======================================
// HANDLERS DE ERRO
// ======================================
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint não encontrado'
  });
});

app.use((err, req, res, next) => {
  logger.error(`🚨 Erro: ${err.stack}`);
  
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message
  });
});

// ======================================
// INICIALIZAÇÃO DO SERVIDOR
// ======================================
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  await connectDB();
  logger.info(`🚀 Servidor rodando na porta ${PORT}`);
});

// ======================================
// DESLIGAMENTO GRACIOSO
// ======================================
const shutdown = (signal) => {
  logger.info(`🛑 Recebido ${signal}, encerrando...`);
  server.close(async () => {
    await mongoose.disconnect();
    logger.info('👋 Servidor encerrado');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
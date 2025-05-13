const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./src/routes/userRoutes');
const logger = require('./src/utils/logger');

// Configuração inicial
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const app = express();

// Configuração de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Limitação de taxa (100 requests por 15 minutos)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});

// Middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Conexão com o MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Usar IPv4
    });
    logger.info('✅ Conectado ao MongoDB');

    mongoose.connection.on('error', err => {
      logger.error(`❌ Erro na conexão: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  Desconectado do MongoDB');
    });

  } catch (err) {
    logger.error(`❌ Falha na conexão: ${err.message}`);
    process.exit(1);
  }
};

// Rotas
app.use('/api/v1/usuarios', apiLimiter, userRoutes);

// Rota de saúde
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Servidor operacional',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Middleware para 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint não encontrado'
  });
});

// Middleware de erros
app.use((err, req, res, next) => {
  logger.error(`🚨 Erro: ${err.stack}`);
  
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Ocorreu um erro no servidor' 
      : err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  await connectDB();
  logger.info(`🚀 Servidor rodando na porta ${PORT} (${process.env.NODE_ENV || 'development'})`);
});

// Desligamento gracioso
const shutdown = (signal) => {
  logger.info(`🛑 Recebido ${signal}, encerrando servidor...`);
  server.close(async () => {
    await mongoose.disconnect();
    logger.info('👋 Servidor encerrado');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
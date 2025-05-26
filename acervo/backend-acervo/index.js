// index_corrigido.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Importe os routers CORRIGIDOS usando import default
import userRoutes from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js'; // Importar as rotas de autenticação

import logger from './src/utils/logger.js'; // Assumindo que logger também usa ES Modules

// Carregar variáveis de ambiente PRIMEIRO!
// Certifique-se de ter um arquivo .env na raiz com MONGODB_URI e JWT_SECRET
dotenv.config();
console.log('JWT_SECRET carregado no index:', process.env.JWT_SECRET); // Adicione esta linha


// Verificar se as variáveis essenciais foram carregadas
if (!process.env.MONGODB_URI) {
  logger.error('❌ Erro crítico: Variável de ambiente MONGODB_URI não definida.');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  logger.error('❌ Erro crítico: Variável de ambiente JWT_SECRET não definida.');
  // Não saia imediatamente, mas a autenticação falhará. O middleware já avisa.
  // process.exit(1);
}

const app = express();

// ======================================
// CONFIGURAÇÕES DE SEGURANÇA
// ======================================
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Adicione OPTIONS para preflight
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ======================================
// PROTEÇÃO CONTRA DDoS E ABUSOS
// ======================================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite cada IP a 100 requisições por janela
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});

// Aplicar o rate limiter a todas as rotas /api
app.use('/api', apiLimiter);

// ======================================
// MIDDLEWARES GLOBAIS
// ======================================
app.use(express.json({ limit: '10kb' })); // Limitar tamanho do payload JSON
app.use(express.urlencoded({ extended: true }));

// ======================================
// CONEXÃO COM BANCO DE DADOS
// ======================================
const connectDB = async () => {
  try {
    // A verificação do MONGODB_URI já foi feita no início
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Forçar IPv4 se necessário
    });
    logger.info('✅ Conectado ao MongoDB');

    mongoose.connection.on('error', err => {
      logger.error(`❌ Erro de conexão MongoDB: ${err.message}`);
    });
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ Desconectado do MongoDB');
    });

  } catch (err) {
    logger.error(`❌ Falha ao conectar ao MongoDB: ${err.message}`);
    // Considerar tentar reconectar ou sair
    process.exit(1);
  }
};

// ======================================
// ROTAS PRINCIPAIS
// ======================================
// Use os routers importados corretamente
app.use('/api/v1/usuarios', userRoutes); // Rota de usuários
app.use('/api/v1/auth', authRoutes);   // Rota de autenticação (login/registro)

// ======================================
// HEALTH CHECK
// ======================================
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Servidor operacional',
    timestamp: new Date().toISOString(),
    mongoState: mongoose.connection.readyState // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
  });
});

// ======================================
// HANDLERS DE ERRO (DEVEM VIR POR ÚLTIMO)
// ======================================
// Handler para rotas não encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: `Endpoint não encontrado: ${req.method} ${req.originalUrl}`
  });
});

// Handler de erro global
app.use((err, req, res, next) => {
  // Log detalhado do erro no servidor
  logger.error(`🚨 Erro não tratado: ${err.message}\n${err.stack}`);

  // Define o status code do erro, padrão 500 se não especificado
  const statusCode = err.statusCode || 500;

  // Resposta genérica em produção para não expor detalhes
  const message = (process.env.NODE_ENV === 'production' && statusCode === 500)
    ? 'Ocorreu um erro interno no servidor.'
    : err.message || 'Erro desconhecido.';

  res.status(statusCode).json({
    success: false,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: message,
    // Opcional: incluir stack trace em desenvolvimento
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });
});

// ======================================
// INICIALIZAÇÃO DO SERVIDOR
// ======================================
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB(); // Conecta ao DB antes de iniciar o servidor
  const server = app.listen(PORT, () => {
    logger.info(`🚀 Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`);
  });
  return server;
};

let serverInstance;
startServer().then(server => { serverInstance = server; });

// ======================================
// DESLIGAMENTO GRACIOSO
// ======================================
const shutdown = (signal) => {
  logger.info(`🛑 Recebido ${signal}. Encerrando servidor graciosamente...`);
  if (serverInstance) {
    serverInstance.close(async () => {
      logger.info('🔌 Servidor HTTP fechado.');
      try {
        await mongoose.disconnect();
        logger.info('🍃 Conexão com MongoDB fechada.');
      } catch (err) {
        logger.error('❌ Erro ao desconectar do MongoDB:', err);
      }
      logger.info('👋 Aplicação encerrada.');
      process.exit(0);
    });
  } else {
    logger.warn('⚠️ Servidor não iniciado, encerrando processo.');
    process.exit(0);
  }

  // Forçar encerramento após timeout
  setTimeout(() => {
    logger.error('❌ Desligamento forçado após timeout.');
    process.exit(1);
  }, 10000); // 10 segundos
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));


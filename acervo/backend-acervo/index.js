import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Rotas
import userRoutes from './src/routes/userRoutes.js';

// Models
import User from './src/models/User.js';

// Utils
import logger from './src/utils/logger.js';

// Configurar variáveis de ambiente
dotenv.config();

// Verificar variáveis essenciais
const {
  MONGODB_URI,
  JWT_SECRET,
  PORT = 3000,
  CORS_ORIGIN,
  NODE_ENV = 'development',
} = process.env;

if (!MONGODB_URI) {
  logger.error('❌ ERRO FATAL: MONGODB_URI não definida no arquivo .env');
  process.exit(1);
}

if (!JWT_SECRET) {
  logger.warn('⚠️ AVISO: JWT_SECRET não definida. JWT pode não funcionar corretamente.');
}

// Inicializar o app
const app = express();

// ===========================================
// MIDDLEWARES DE SEGURANÇA E CONFIGURAÇÃO
// ===========================================
app.use(helmet());

app.use(cors({
  origin: CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ===========================================
// RATE LIMIT — Proteção contra DDoS
// ===========================================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message: 'Muitas requisições. Tente novamente mais tarde.',
  },
});

app.use('/api', apiLimiter);

// ===========================================
// CONEXÃO COM O BANCO DE DADOS
// ===========================================
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info('✅ MongoDB conectado com sucesso.');

    mongoose.connection.on('error', (err) => {
      logger.error(`❌ Erro no MongoDB: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB desconectado.');
    });

  } catch (error) {
    logger.error(`❌ Falha ao conectar no MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// ===========================================
// ROTAS
// ===========================================
app.use('/api/v1/usuarios', userRoutes);

// Healthcheck
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'Servidor operacional',
    timestamp: new Date().toISOString(),
    mongoState: mongoose.connection.readyState,
    environment: NODE_ENV,
  });
});

app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'Email e senha são obrigatórios.',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Email ou senha incorretos.',
      });
    }

    if (!user.senha) {
      logger.error(`Usuário encontrado, mas senha não está definida no banco para ${email}`);
      return res.status(500).json({
        success: false,
        code: 'MISSING_PASSWORD',
        message: 'Senha não encontrada no banco. Contate o suporte.',
      });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Email ou senha incorretos.',
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso.',
      token,
    });

  } catch (error) {
    logger.error(`🚨 Erro no login: ${error.message}`);
    return res.status(500).json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Erro interno no servidor.',
    });
  }
});


// ===========================================
// HANDLERS DE ERRO
// ===========================================

// 404 — Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: `Endpoint não encontrado: ${req.method} ${req.originalUrl}`,
  });
});

// 500 — Erro interno
app.use((err, req, res, next) => {
  logger.error(`🚨 Erro inesperado: ${err.message}\n${err.stack}`);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message:
      NODE_ENV === 'production' && statusCode === 500
        ? 'Erro interno no servidor.'
        : err.message,
    ...(NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  });
});

// ===========================================
// START SERVER
// ===========================================
let serverInstance;

const startServer = async () => {
  await connectDB();
  serverInstance = app.listen(PORT, () => {
    logger.info(`🚀 Servidor rodando em http://localhost:${PORT} [${NODE_ENV}]`);
  });
};

startServer();

// ===========================================
// SHUTDOWN GRACIOSO
// ===========================================
const gracefulShutdown = (signal) => {
  logger.info(`🛑 Recebido ${signal}. Encerrando servidor...`);

  if (serverInstance) {
    serverInstance.close(async () => {
      logger.info('🔌 Servidor HTTP fechado');
      try {
        await mongoose.disconnect();
        logger.info('🍃 MongoDB desconectado');
      } catch (error) {
        logger.error(`❌ Erro ao desconectar MongoDB: ${error.message}`);
      }
      logger.info('👋 Aplicação encerrada com sucesso');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('⏰ Forçando desligamento após timeout');
      process.exit(1);
    }, 10000);
  } else {
    logger.warn('⚠️ Servidor não estava rodando. Encerrando processo.');
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// index.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

// Rotas
import userRoutes from './src/routes/userRoutes.js';

// Utils
import logger from './src/utils/logger.js';

// Models
import User from './src/models/User.js';


// Configurações de ambiente
dotenv.config();

const {
  MONGODB_URI,
  JWT_SECRET,
  PORT = 3000,
  CORS_ORIGIN,
  NODE_ENV = 'development',
} = process.env;

if (!MONGODB_URI) {
  logger.error('❌ MONGODB_URI não definida.');
  process.exit(1);
}

if (!JWT_SECRET) {
  logger.warn('⚠️ JWT_SECRET não definida. Tokens podem não funcionar.');
}

// Inicialização do App
const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: CORS_ORIGIN || '*',
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Muitas requisições, tente novamente mais tarde.',
  },
});
app.use('/api', apiLimiter);

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('✅ MongoDB conectado.');
  } catch (error) {
    logger.error(`❌ Erro ao conectar no MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Rotas
app.use('/api/v1/usuarios', userRoutes);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
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
        message: 'Email e senha são obrigatórios.',
      });
    }

    const user = await User.findOne({ email }).select('+senha');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos.',
      });
    }

    const senhaCorreta = await user.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos.',
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso.',
      token,
    });

  } catch (error) {
    logger.error(`🚨 Erro no login: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro interno no servidor.',
    });
  }
});

// Rota de Logout Corrigida
app.post('/api/v1/auth/logout', (req, res) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Token não fornecido.',
    });
  }

  const token = authHeader.split(' ')[1]; // Remove o "Bearer "

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Formato de token inválido.',
    });
  }

  try {
    // Verificação tolerante a tokens expirados
    jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }, (err) => {
      // Só rejeitamos se for erro de assinatura, não de expiração
      if (err && err.name !== 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token inválido.',
        });
      }
const tokenBlacklist = new Set();

      // Adicionar token à blacklist
      tokenBlacklist.add(token);
      
      return res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso.',
      });
    });
  } catch (error) {
    console.error('🚨 Erro no logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno no servidor.',
    });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// Error Handler
app.use((err, req, res, next) => {
  logger.error(`🚨 Erro inesperado: ${err.message}`);
  res.status(err.statusCode || 500).json({
    success: false,
    message:
      NODE_ENV === 'production' && err.statusCode === 500
        ? 'Erro interno no servidor.'
        : err.message,
  });
});

// Start Server
let serverInstance;

const startServer = async () => {
  await connectDB();
  serverInstance = app.listen(PORT, () => {
    logger.info(`🚀 Servidor rodando em http://localhost:${PORT} [${NODE_ENV}]`);
  });
};

startServer();

// Graceful Shutdown
const gracefulShutdown = (signal) => {
  logger.info(`🛑 Recebido ${signal}. Encerrando servidor...`);
  if (serverInstance) {
    serverInstance.close(async () => {
      await mongoose.disconnect();
      logger.info('👋 MongoDB desconectado e servidor encerrado.');
      process.exit(0);
    });
    setTimeout(() => {
      logger.error('⏰ Timeout! Forçando desligamento.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));


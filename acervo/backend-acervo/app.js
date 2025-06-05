import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

import './database/database.js'; // conexão MongoDB
import cors from 'cors';

const app = express();

// Middlewares globais
app.use(helmet());
app.use(express.json());

// Rate limiter para segurança
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente mais tarde.',
  },
});
app.use('/api/', apiLimiter);

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API rodando com sucesso',
    timestamp: new Date().toISOString(),
  });
});

// Rota padrão
app.get('/', (req, res) => {
  res.send('API rodando com sucesso!');
});

// Handler 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
  });
});

// Handler global de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno no servidor',
    error: err.message,
  });
});

export default app;

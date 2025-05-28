import winston from 'winston';
import fs from 'fs';
import path from 'path';

// Cria a pasta 'logs' se ela não existir
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Loga erros em arquivo separado
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    // Loga todos os logs em arquivo geral
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, 'rejections.log') })
  ]
});

// Se não for produção, também loga no console em formato mais legível
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;

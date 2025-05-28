import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'secretao';
export const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/seu-banco';

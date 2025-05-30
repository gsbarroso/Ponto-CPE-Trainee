import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
export const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://gustavo05sb:28042005Gu$B@sistemaponto.r7cxsbm.mongodb.net/sistemaPonto?retryWrites=true&w=majority';

import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';
export const JWT_EXPIRES_IN = '1h';

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
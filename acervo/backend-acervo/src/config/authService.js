import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};

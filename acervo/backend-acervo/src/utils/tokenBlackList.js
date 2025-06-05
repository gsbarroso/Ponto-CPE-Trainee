// utils/tokenBlacklist.js
const tokenBlacklist = new Set();

export const addToBlacklist = (token) => {
  tokenBlacklist.add(token);
};

export const isTokenRevoked = (token) => {
  return tokenBlacklist.has(token);
};

// Limpeza periódica de tokens expirados
setInterval(() => {
  tokenBlacklist.forEach(token => {
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp < Date.now() / 1000) {
        tokenBlacklist.delete(token);
      }
    } catch {
      tokenBlacklist.delete(token);
    }
  });
}, 3600000); // A cada hora
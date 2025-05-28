function verificarJwt(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader) {
        console.log('authHeader:', authHeader);
        next();
    } else {
        console.error('❌ Nenhum token encontrado no header Authorization');
        return res.status(401).json({ error: 'Token não encontrado. Acesso negado!' });
    }
}

module.exports = verificarJwt;

// src/middlewares/autorizacao.js
const autorizar = (...cargosPermitidos) => {
  return (req, res, next) => {
    try {
      if (!req.userData) {
        return res.status(401).json({
          success: false,
          message: 'Autenticação requerida'
        });
      }

      const cargoUsuario = req.userData.cargo;
      
      if (!cargoUsuario) {
        return res.status(403).json({
          success: false,
          message: 'Cargo não definido'
        });
      }

      if (!cargosPermitidos.includes(cargoUsuario)) {
        return res.status(403).json({
          success: false,
          message: 'Acesso não autorizado',
          cargosRequeridos: cargosPermitidos,
          cargoAtual: cargoUsuario
        });
      }

      next();

    } catch (error) {
      console.error('Erro na autorização:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno no sistema'
      });
    }
  };
};

module.exports = autorizar; // Exportação corrigida
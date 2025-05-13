// src/middlewares/autorizar.js

const autorizar = (...cargosPermitidos) => {
  return (req, res, next) => {
    try {
      // 1. Verificar se o usuário está autenticado
      if (!req.userData) {
        return res.status(401).json({
          success: false,
          message: 'Autenticação requerida'
        });
      }

      // 2. Verificar se o usuário possui um cargo válido
      const cargoUsuario = req.userData.cargo;
      
      if (!cargoUsuario) {
        return res.status(403).json({
          success: false,
          message: 'Cargo do usuário não definido'
        });
      }

      // 3. Verificar se o cargo está na lista de permitidos
      if (!cargosPermitidos.includes(cargoUsuario)) {
        return res.status(403).json({
          success: false,
          message: 'Acesso não autorizado',
          requiredRoles: cargosPermitidos,
          currentRole: cargoUsuario
        });
      }

      // 4. Se tudo estiver OK, prosseguir
      next();

    } catch (error) {
      console.error('Erro na autorização:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno no sistema de autorização'
      });
    }
  };
};

module.exports = autorizar;
const { ValidationError } = require('sequelize');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Cria um novo usuário
 * Método: POST
 * Rota: /usuarios
 */
exports.createUser = async (req, res) => {
  try {
    const { senha } = req.body;

    // No método POST, não criptografamos a senha
    // Apenas passamos a senha diretamente do corpo da requisição para o banco
    if (senha) {
      req.body.senha = senha; // Mantém a senha original
    }

    // Gerando um novo ID único sem lacunas
    req.body.id_usuario = await generateNewId();

    // Criação do usuário
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (err) {
    if (err instanceof ValidationError) {
      return handleValidationError(err, res);
    }
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Retorna todos os usuários
 * Método: GET
 * Rota: /usuarios
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    if (users.length === 0) {
      return res.status(404).json({ message: 'Nenhum usuário encontrado' });
    }

    // Criptografando a senha antes de retornar os dados (somente aqui, ao retornar os dados)
    const usersWithHashedPasswords = await Promise.all(users.map(async (user) => {
      const userData = user.dataValues;
      if (userData.senha) {
        // Criptografando a senha antes de retornar os dados
        userData.senha = await bcrypt.hash(userData.senha, 10);
      }
      return userData;
    }));

    return res.status(200).json(usersWithHashedPasswords);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar usuários: ' + err.message });
  }
};

/**
 * Retorna um usuário por ID
 * Método: GET
 * Rota: /usuarios/:id
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const userData = user.dataValues;
    if (userData.senha) {
      // Criptografando a senha antes de retornar os dados
      userData.senha = await bcrypt.hash(userData.senha, 10);
    }

    return res.status(200).json(userData);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

/**
 * Atualiza um usuário por ID
 * Método: PUT
 * Rota: /usuarios/:id
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID não fornecido' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (req.body.id_usuario && req.body.id_usuario !== id) {
      return res.status(400).json({ error: 'Não é permitido alterar o ID do usuário' });
    }

    // Se a senha for fornecida no PUT, criptografamos ela antes de salvar
    if (req.body.senha) {
      req.body.senha = await bcrypt.hash(req.body.senha, 10); // Criptografando a senha
    }

    await user.update(req.body);
    return res.status(200).json(user);
  } catch (err) {
    if (err instanceof ValidationError) {
      return handleValidationError(err, res);
    }
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Deleta um usuário por ID
 * Método: DELETE
 * Rota: /usuarios/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    await user.destroy();
    return res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};

/**
 * Função para gerar um novo ID único sem lacunas
 */
async function generateNewId() {
  const users = await User.findAll();
  const ids = users.map(user => user.id_usuario);
  ids.sort((a, b) => a - b);

  // Se o ID 1 não existir, retornamos 1
  if (!ids.includes(1)) {
    return 1;
  }

  // Procurando lacunas nos IDs
  for (let i = 1; i < ids.length; i++) {
    if (ids[i] !== ids[i - 1] + 1) {
      return ids[i - 1] + 1;
    }
  }

  // Se não houver lacunas, retornamos o próximo ID após o maior
  return ids[ids.length - 1] + 1;
}

/**
 * Função para tratar erros de validação de email duplicado
 */
function handleValidationError(err, res) {
  if (err.errors.some(error => error.path === 'email')) {
    return res.status(400).json({ error: 'Este email já está registrado' });
  }
  return res.status(400).json({ error: err.message });
}

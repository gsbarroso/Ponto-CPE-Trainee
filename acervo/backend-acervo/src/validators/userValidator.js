module.exports = function validateUser(data) {
  const errors = [];

  // Validação do nome
  if (!data.nome || data.nome.trim() === '') {
    errors.push("Nome é obrigatório");
  }

  // Validação do email
  if (!data.email || data.email.trim() === '') {
    errors.push("Email é obrigatório");
  } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(data.email)) {
    errors.push("Email inválido");
  }

  // Validação do cargo
  if (!data.cargo || data.cargo.trim() === '') {
    errors.push("Cargo é obrigatório");
  }

  // Validação da senha
  if (!data.senha || data.senha.trim() === '') {
    errors.push("Senha é obrigatória");
  } else if (data.senha.length < 6) {
    errors.push("A senha deve ter pelo menos 6 caracteres");
  }

  // Validação do nível (booleano)
  if (typeof data.nivel !== "boolean") {
    errors.push("Nível deve ser booleano");
  }

  return errors;
};

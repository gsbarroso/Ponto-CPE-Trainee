module.exports = function validateUser(data) {
  const errors = [];

  if (!data.nome) errors.push("Nome é obrigatório");
  if (!data.email) errors.push("Email é obrigatório");
  if (!data.cargo) errors.push("Cargo é obrigatório");
  if (!data.senha) errors.push("Senha é obrigatória");
  if (typeof data.nivel !== "boolean") errors.push("Nível deve ser booleano");

  return errors;
};

// Seleciona o formulário e o elemento para exibir mensagens
const formCadastro = document.getElementById('formCadastro');
const mensagemElement = document.getElementById('mensagem');

// Adiciona um ouvinte de evento para o envio do formulário
formCadastro.addEventListener('submit', async (event) => {
  // Previne o comportamento padrão de envio do formulário (recarregar a página)
  event.preventDefault();

  // Limpa mensagens anteriores
mensagemElement.textContent = '';

  // Coleta os dados dos campos do formulário
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const cargo = document.getElementById('cargo').value;

  // Cria o objeto de dados para enviar à API
  const dadosUsuario = {
    nome: nome,
    email: email,
    senha: senha,
    cargo: cargo
    // O backend parece lidar com id_usuario, nivel_acesso e createdAt automaticamente
  };

  // Define a URL da API de cadastro
  const apiUrl = 'http://localhost:3000/api/v1/usuarios/';

  try {
    // Envia a requisição POST para a API usando fetch
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosUsuario), // Converte os dados para JSON
    });

    // Verifica se a requisição foi bem-sucedida
    if (response.ok) {
      const resultado = await response.json(); // Pega a resposta JSON do backend
      mensagemElement.textContent = 'Cadastro realizado com sucesso!';
      mensagemElement.style.color = 'green';
      formCadastro.reset(); // Limpa o formulário após o sucesso
      console.log('Usuário cadastrado:', resultado); // Log para debug
    } else {
      // Se houve erro na resposta (ex: validação, erro no servidor)
      const erroData = await response.json(); // Tenta pegar a mensagem de erro do backend
      mensagemElement.textContent = `Erro ao cadastrar: ${erroData.message || response.statusText}`;
      mensagemElement.style.color = 'red';
      console.error('Erro da API:', erroData);
    }
  } catch (error) {
    // Se houve um erro de rede ou outro erro durante o fetch
    mensagemElement.textContent = 'Erro de conexão ao tentar cadastrar. Verifique o console.';
    mensagemElement.style.color = 'red';
    console.error('Erro no fetch:', error);
  }
});


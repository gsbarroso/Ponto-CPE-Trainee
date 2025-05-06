# Backend - CPE (Controle de Processos e Eventos)

Este projeto é um backend para controle de processos e eventos, desenvolvido com Node.js, Express, Sequelize e SQLite.

---

## 📂 Estrutura do Projeto
BACKEND-CPE/
├── src/
│ ├── config/
│ │ └── database.js # Configuração do banco de dados
│ ├── controllers/
│ │ └── userController.js # Lógica dos usuários
│ ├── database/
│ │ └── db.sqlite # Arquivo do banco SQLite
│ ├── models/
│ │ └── User.js # Modelo de usuário
│ ├── routes/
│ │ └── userRoutes.js # Rotas da API
│ └── server.js # Configuração do servidor
├── .env # Variáveis de ambiente
├── index.js # Ponto de entrada
├── package.json
└── package-lock.json


---

## 🛠️ Pré-requisitos
- Node.js (v18 ou superior)
- npm (v9 ou superior)

---

## ⚙️ Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://seu-repositorio.git
   cd BACKEND-CPE
Instale as dependências:

bash
npm install
Crie o arquivo .env:

ini
PORT=3000
🚀 Execução
Modo desenvolvimento (com hot-reload):

bash
npm run dev
Modo produção:

bash
npm start
🌐 Endpoints da API
Método	Rota	Descrição
POST	/usuarios	Cria um novo usuário
GET	/usuarios	Lista todos os usuários
GET	/usuarios/:id	Busca um usuário por ID
PUT	/usuarios/:id	Atualiza um usuário
DELETE	/usuarios/:id	Exclui um usuário
🗃️ Banco de Dados
SQLite: O arquivo db.sqlite será gerado automaticamente em src/database após a primeira execução.

Modelo: Definição da tabela Users em src/models/User.js.

🧪 Testando com CURL
Criar usuário:

bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome": "João Silva", "email": "joao@email.com", "senha": "123456"}'
Listar usuários:

bash
curl -X GET http://localhost:3000/usuarios
🔧 Solução de Problemas
Erro 404: Verifique se a URL está correta (ex: /usuarios, não /users).

Erro 500: Consulte os logs do terminal para detalhes (ex: falha na conexão com o banco).
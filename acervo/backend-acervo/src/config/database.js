const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente do .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  });

module.exports = mongoose;

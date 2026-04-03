const express = require('express');
const cors = require('cors');
require('./database/db');
const { login } = require('./controllers/authController');

const app = express();

app.use(cors()); 
app.use(express.json());

// Rota de Login
app.post('/api/login', login);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`✅ Endpoint de login: http://localhost:${PORT}/api/login`);
});
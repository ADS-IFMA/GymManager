const express = require('express');
const cors = require('cors');
const { login } = require('./controllers/authController');

const app = express();

app.use(cors()); 
app.use(express.json());

app.post('/api/login', login);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Endpoint de login disponível em: http://localhost:${PORT}/api/login`);
});

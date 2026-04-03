const express = require('express');
const cors = require('cors');
const { login } = require('./src/controllers/authController');
const { registerAluno } = require('./src/controllers/alunoController');

const app = express();

app.use(cors()); 
app.use(express.json());

app.post('/api/login', login);
app.post('/api/alunos', registerAluno);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Endpoint de login disponível em: http://localhost:${PORT}/api/login`);
  console.log(`Endpoint de cadastro de aluno disponível em: http://localhost:${PORT}/api/alunos`);
});

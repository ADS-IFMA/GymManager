import express from 'express';
import cors from 'cors';
import './database/db.js'; 
import { login } from './controllers/authController.js'; 

const app = express();

app.use(cors()); 
app.use(express.json());
app.post('/api/login', login);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando no padrão ES Modules (import/export)`);
  console.log(`✅ Porta: ${PORT}`);
  console.log(`🔗 Endpoint: http://localhost:${PORT}/api/login`);
});
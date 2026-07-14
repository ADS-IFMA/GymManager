import express from 'express';
import cors from 'cors';
import './database/db.js';
import authRoutes from './routes/authRoutes.js';
import alunoRoutes from './routes/alunoRoutes.js';
import profissionalRoutes from './routes/profissionalRoutes.js';
import atividadeRoutes from './routes/atividadeRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', alunoRoutes);
app.use('/api', profissionalRoutes);
app.use('/api', atividadeRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando no padrão ES Modules (import/export)`);
  console.log(`✅ Porta: ${PORT}`);
  console.log(`🔗 Endpoint de login: http://localhost:${PORT}/api/login`);
  console.log(`🔗 Endpoint de alunos: http://localhost:${PORT}/api/alunos`);
  console.log(`🔗 Endpoint de profissionais: http://localhost:${PORT}/api/profissionais`);
  console.log(`🔗 Endpoint de atividades: http://localhost:${PORT}/api/atividades`);
});
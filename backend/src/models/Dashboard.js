import pool from '../database/db.js';

class Dashboard {
  static async obterMetricasGlobais() {
    const queryAlunosAtivos = `
      SELECT COUNT(u.id) AS total
      FROM usuarios u
      JOIN alunos a ON u.id = a.id_usuario
      WHERE u.ativo = true;
    `;

    const queryOcupacao = `
      SELECT COUNT(id) AS total
      FROM agendamentos
      WHERE status = 'Confirmado';
    `;

    const queryAgendamentosDiarios = `
      SELECT COUNT(id) AS total
      FROM agendamentos
      WHERE DATE(data_hora) = CURRENT_DATE;
    `;

    const [resAlunos, resOcupacao, resDiarios] = await Promise.all([
      pool.query(queryAlunosAtivos),
      pool.query(queryOcupacao),
      pool.query(queryAgendamentosDiarios)
    ]);

    return {
      alunosAtivos: parseInt(resAlunos.rows[0].total, 10),
      ocupacaoAtividades: parseInt(resOcupacao.rows[0].total, 10),
      agendamentosHoje: parseInt(resDiarios.rows[0].total, 10)
    };
  }
}

export default Dashboard;
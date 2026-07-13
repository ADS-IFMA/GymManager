import db from '../database/db.js';
import Inscricao from '../models/Inscricao.js';
import Atividade from '../models/Atividade.js';
import Usuario from '../models/Usuario.js';

class InscricaoService {
  async inscrever(id_aluno, id_atividade) {
    if (!id_aluno || isNaN(id_aluno) || !id_atividade || isNaN(id_atividade)) {
      throw new Error('ID do aluno e da atividade são obrigatórios e devem ser números válidos.');
    }

    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // Verificar se aluno existe
      const queryAluno = 'SELECT * FROM usuarios WHERE id = $1 AND perfil = $2';
      const resultAluno = await client.query(queryAluno, [id_aluno, 'ALUNO']);
      if (resultAluno.rows.length === 0) {
        throw new Error('Aluno não encontrado.');
      }

      // Verificar se atividade existe
      const queryAtividade = 'SELECT * FROM atividades WHERE id = $1';
      const resultAtividade = await client.query(queryAtividade, [id_atividade]);
      if (resultAtividade.rows.length === 0) {
        throw new Error('Atividade não encontrada.');
      }

      const atividade = resultAtividade.rows[0];

      // Verificar se já está inscrito
      const queryVerificar = `
        SELECT * FROM inscricoes
        WHERE id_aluno = $1 AND id_atividade = $2
      `;
      const resultVerificar = await client.query(queryVerificar, [id_aluno, id_atividade]);
      if (resultVerificar.rows.length > 0) {
        throw new Error('Você já está inscrito nesta atividade.');
      }

      // Contar inscritos atuais
      const queryContar = `
        SELECT COUNT(*) as total FROM inscricoes
        WHERE id_atividade = $1
      `;
      const resultContar = await client.query(queryContar, [id_atividade]);
      const totalInscritos = parseInt(resultContar.rows[0].total);

      // Verificar limite de vagas
      if (totalInscritos >= atividade.limite_vagas) {
        throw new Error('Limite de vagas atingido para esta atividade.');
      }

      // Inserir inscrição
      const queryInserir = `
        INSERT INTO inscricoes (id_aluno, id_atividade)
        VALUES ($1, $2)
        RETURNING *
      `;
      const resultInserir = await client.query(queryInserir, [id_aluno, id_atividade]);

      await client.query('COMMIT');
      return new Inscricao(resultInserir.rows[0]).toJSON();
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async cancelar(id_aluno, id_atividade) {
    if (!id_aluno || isNaN(id_aluno) || !id_atividade || isNaN(id_atividade)) {
      throw new Error('ID do aluno e da atividade são obrigatórios e devem ser números válidos.');
    }

    const resultado = await Inscricao.cancelar(id_aluno, id_atividade);
    if (!resultado) {
      throw new Error('Inscrição não encontrada ou já foi cancelada.');
    }

    return { mensagem: 'Inscrição cancelada com sucesso.' };
  }

  async listarInscritos(id_atividade) {
    if (!id_atividade || isNaN(id_atividade)) {
      throw new Error('ID da atividade é obrigatório e deve ser um número válido.');
    }

    const atividade = await Atividade.buscarPorId(id_atividade);
    if (!atividade) {
      throw new Error('Atividade não encontrada.');
    }

    const inscritos = await Inscricao.buscarPorAtividade(id_atividade);
    const total = await Inscricao.contagemInscritos(id_atividade);

    return {
      id_atividade,
      total_inscritos: total,
      vagas_disponiveis: atividade.limite_vagas - total,
      inscritos: inscritos.map(i => ({
        id: i.id,
        id_aluno: i.id_aluno,
        aluno_nome: i.aluno_nome,
        aluno_email: i.aluno_email,
        data_inscricao: i.data_inscricao,
      })),
    };
  }

  async listarInscricoesAluno(id_aluno) {
    if (!id_aluno || isNaN(id_aluno)) {
      throw new Error('ID do aluno é obrigatório e deve ser um número válido.');
    }

    const usuario = await Usuario.buscarPorEmail(id_aluno) ||
                    (await db.query('SELECT * FROM usuarios WHERE id = $1', [id_aluno])).rows[0];

    if (!usuario) {
      throw new Error('Aluno não encontrado.');
    }

    const inscricoes = await Inscricao.buscarPorAluno(id_aluno);
    return inscricoes;
  }
}

export default new InscricaoService();

/**
 * Entidade Usuário - GymManager
 * Representa o modelo de dados para autenticação e perfis.
 */
class Usuario {
  constructor({ id, nome, email, senha, perfil, ativo, criado_at }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha; // Hash da senha
    this.perfil = perfil; // ADMIN, PROFISSIONAL ou ALUNO
    this.ativo = ativo || true;
    this.criado_at = criado_at;
  }

  // Método simples para retornar dados sem a senha (segurança)
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      perfil: this.perfil,
      ativo: this.ativo,
    };
  }
}

module.exports = Usuario;

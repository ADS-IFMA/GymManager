import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

class AuthService {
  async autenticar(email, senha) {
    // 1. Ajustado para o nome correto do método no Model (buscarPorEmail)
    // Usamos o trim() e o toLowerCase() para evitar erros se o usuário digitar espaços ou maiúsculas
    const usuario = await Usuario.buscarPorEmail(email.trim().toLowerCase());

    if (!usuario) {
      console.log(
        `[AuthService] Tentativa de login falhou: E-mail não encontrado (${email})`,
      );
      throw new Error("Credenciais inválidas.");
    }

    // Se no seu banco a coluna se chamar 'ativo', essa verificação passa normal
    // Se não tiver essa coluna ainda, pode comentar a linha abaixo temporariamente para a apresentação
    if (usuario.ativo === false) {
      throw new Error("Usuário desativado. Procure o administrador.");
    }

    // 2. O Bcrypt vai comparar a senha digitada ('admin123') com o Hash que injetamos no pgAdmin
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      console.log(
        `[AuthService] Tentativa de login falhou: Senha incorreta para o e-mail: ${email}`,
      );
      throw new Error("Credenciais inválidas.");
    }

    console.log(
      `[AuthService] Usuário autenticado com sucesso: ${usuario.nome}`,
    );

    // 3. Substituído 'perfil' por 'tipo_usuario' para bater com o banco de dados
    const token = jwt.sign(
      { id: usuario.id, tipo_usuario: usuario.tipo_usuario },
      "gymmanager_secret_2026",
      { expiresIn: "8h" },
    );

    // Se o método toJSON() der erro na apresentação por não estar mapeado,
    // você pode retornar apenas o objeto puro: usuario
    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
    };
  }
}

export default new AuthService();

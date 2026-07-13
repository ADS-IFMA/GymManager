import pkg from "pg";
const { Pool } = pkg;

// Configurações para o notebook do seu amigo
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "gymmanager_db",
  password: "admin123", // Senha que o Tauan definiu no Merge
  port: 5432,
});

// Teste de conexão (O que você está tentando rodar)
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Erro ao conectar ao PostgreSQL:", err.stack);
  } else {
    console.log("✅ Conectado ao PostgreSQL com sucesso!");
  }
});

export default pool;

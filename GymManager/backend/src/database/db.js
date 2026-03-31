const { Pool } = require("pg");

// Configurações extraídas do seu ambiente local
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "gymmanager_db",
  password: "admin123",
  port: 5432,
});

// Teste de conexão imediato
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error(" Erro ao conectar ao PostgreSQL:", err.stack);
  } else {
    console.log(" Conectado ao PostgreSQL com sucesso em:", res.rows[0].now);
  }
});

module.exports = pool;

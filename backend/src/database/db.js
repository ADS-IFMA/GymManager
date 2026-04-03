import pkg from 'pg'; 
const { Pool } = pkg; 

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "gymmanager_db",
  password: "Admin",
  port: 5432,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Erro ao conectar ao PostgreSQL:", err.stack);
  } else {
    console.log("✅ Conectado ao PostgreSQL com sucesso!");
  }
});

export default pool; 
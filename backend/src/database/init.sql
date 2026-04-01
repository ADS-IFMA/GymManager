-- Script de Criação da Tabela de Usuários
-- Local: backend/src/database/init.sql

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, -- Guardaremos o hash, não a senha real
    perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('ADMIN', 'PROFISSIONAL', 'ALUNO')),
    ativo BOOLEAN DEFAULT TRUE,
    criado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir um Admin padrão para testes (Senha: admin123 - Exemplo)
-- Nota: Em produção, a senha deve ser criptografada via Bcrypt no Node.js
INSERT INTO usuarios (nome, email, senha, perfil) 
VALUES ('Administrador Master', 'admin@gymmanager.com', 'senha_provisoria', 'ADMIN')
ON CONFLICT (email) DO NOTHING;
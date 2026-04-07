-- Script de Criação da Tabela de Usuários
-- Local: backend/src/database/init.sql

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, -- Guardaremos o hash, não a senha real
    perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('ADMIN', 'PROFISSIONAL', 'ALUNO')),
    ativo BOOLEAN DEFAULT TRUE,
    tipo_usuario VARCHAR(50),
    data_nasc DATE,           
    telefone VARCHAR(100),     
    criado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir um Admin padrão para testes (Senha: admin123 - Exemplo)
-- Nota: Em produção, a senha deve ser criptografada via Bcrypt no Node.js
-- Mude o final do seu init.sql para isso:
INSERT INTO usuarios (nome, email, senha, tipo_usuario, data_nasc, telefone) 
VALUES ('Administrador Master', 'admin@gymmanager.com', 'senha_provisoria', 'ADMIN', '2000-01-01', '98999999999')
ON CONFLICT (email) DO NOTHING;
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


-- Criação das tabelas principais do GymManager
-- Local: backend/src/database/tables.sql

-- 1. Tabela de Treinadores (Relacionada a Usuarios)
CREATE TABLE IF NOT EXISTS treinadores (
    id_usuario INTEGER PRIMARY KEY REFERENCES usuarios(id),
    registro_profissional VARCHAR(15) UNIQUE NOT NULL,
    especialidade VARCHAR(50)
);

-- 2. Tabela de Alunos (Relacionada a Usuarios)
CREATE TABLE IF NOT EXISTS alunos (
    id_usuario INTEGER PRIMARY KEY REFERENCES usuarios(id),
    status_matricula BOOLEAN DEFAULT TRUE
);

-- 3. Tabela de Atividades
CREATE TABLE IF NOT EXISTS atividades (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao VARCHAR(255),
    vagas INTEGER NOT NULL
);

-- 4. Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES alunos(id_usuario),
    id_atividade INTEGER REFERENCES atividades(id),
    data_hora TIMESTAMP NOT NULL,
    status VARCHAR(15) -- Ex: Confirmado, Cancelado
);

-- 5. Tabela de Treinos
CREATE TABLE IF NOT EXISTS treinos (
    id SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES alunos(id_usuario),
    id_profissional INTEGER REFERENCES treinadores(id_usuario),
    descricao_treino VARCHAR(255),
    data_criacao DATE DEFAULT CURRENT_DATE
);

-- 6. Tabela de Avaliações Físicas
CREATE TABLE IF NOT EXISTS avaliacoes_fisicas (
    id SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES alunos(id_usuario),
    id_profissional INTEGER REFERENCES treinadores(id_usuario),
    data_avaliacao DATE DEFAULT CURRENT_DATE,
    peso DECIMAL(5,2),
    altura DECIMAL(3,2),
    medidas_corporais VARCHAR(255),
    descricao VARCHAR(255),
    fk_treinadores_registro_profissional VARCHAR(15)
);

-- 7. Tabela de Check-ins
CREATE TABLE IF NOT EXISTS checkins (
    id SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES alunos(id_usuario),
    data_horat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50)
);

-- 8. Tabela de Mensalidades
CREATE TABLE IF NOT EXISTS mensalidades (
    id SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES alunos(id_usuario),
    valor DECIMAL(10,2) NOT NULL,
    data_vesc DATE NOT NULL,
    status_pagamento BOOLEAN DEFAULT FALSE
);
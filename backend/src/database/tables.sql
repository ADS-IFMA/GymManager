CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('ADMIN', 'PROFISSIONAL', 'ALUNO')),
    ativo BOOLEAN DEFAULT TRUE,
    tipo_usuario VARCHAR(50),
    data_nasc DATE,           
    telefone VARCHAR(100),     
    criado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO usuarios (nome, email, senha, perfil, ativo, tipo_usuario, data_nasc, telefone)
VALUES ('Administrador Master', 'admin@gymmanager.com', 'senha_provisoria', 'ADMIN', true, 'ADMIN', '2000-01-01', '98999999999')
ON CONFLICT (email) DO NOTHING;




CREATE TABLE IF NOT EXISTS treinadores (
    id_usuario INTEGER PRIMARY KEY REFERENCES usuarios(id),
    registro_profissional VARCHAR(15) UNIQUE NOT NULL,
    especialidade VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS alunos (
    id_usuario INTEGER PRIMARY KEY REFERENCES usuarios(id),
    status_matricula BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS atividades (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_hora TIMESTAMP NOT NULL,
    limite_vagas INT NOT NULL CHECK (limite_vagas > 0),
    id_profissional INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES alunos(id_usuario),
    id_atividade INTEGER REFERENCES atividades(id),
    data_hora TIMESTAMP NOT NULL,
    status VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS treinos (
    id SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES alunos(id_usuario),
    id_profissional INTEGER REFERENCES treinadores(id_usuario),
    descricao_treino VARCHAR(255),
    data_criacao DATE DEFAULT CURRENT_DATE
);

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

CREATE TABLE IF NOT EXISTS checkins (
    id SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES alunos(id_usuario),
    data_horat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS mensalidades (
    id SERIAL PRIMARY KEY,
    id_aluno INTEGER REFERENCES alunos(id_usuario),
    valor DECIMAL(10,2) NOT NULL,
    data_vesc DATE NOT NULL,
    status_pagamento BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS inscricoes (
    id SERIAL PRIMARY KEY,
    id_aluno INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    id_atividade INT NOT NULL REFERENCES atividades(id) ON DELETE CASCADE,
    data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_aluno, id_atividade)
);

CREATE INDEX IF NOT EXISTS idx_atividades_profissional ON atividades(id_profissional);
CREATE INDEX IF NOT EXISTS idx_inscricoes_atividade ON inscricoes(id_atividade);
CREATE INDEX IF NOT EXISTS idx_inscricoes_aluno ON inscricoes(id_aluno);
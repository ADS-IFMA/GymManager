-- Script para deletar TODAS as tabelas do banco
-- ⚠️ ATENÇÃO: Isso APAGARÁ todos os dados! Use com cuidado

DROP TABLE IF EXISTS inscricoes CASCADE;
DROP TABLE IF EXISTS mensalidades CASCADE;
DROP TABLE IF EXISTS checkins CASCADE;
DROP TABLE IF EXISTS avaliacoes_fisicas CASCADE;
DROP TABLE IF EXISTS treinos CASCADE;
DROP TABLE IF EXISTS agendamentos CASCADE;
DROP TABLE IF EXISTS atividades CASCADE;
DROP TABLE IF EXISTS alunos CASCADE;
DROP TABLE IF EXISTS treinadores CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Agora execute o arquivo tables.sql para recriar tudo
-- psql -U postgres -d gymmanager_db -f backend/src/database/tables.sql

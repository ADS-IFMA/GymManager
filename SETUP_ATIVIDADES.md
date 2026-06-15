# Setup do Módulo de Agendamento de Atividades

## Passo 1: Criar/Atualizar as Tabelas do Banco de Dados

Execute o script SQL existente que foi atualizado com as novas tabelas:

**Via Command Line (recomendado):**
```bash
psql -U postgres -d gymmanager_db -f backend/src/database/tables.sql
```

**Via pgAdmin ou psql interativo:**
- Abra o arquivo `backend/src/database/tables.sql`
- Execute todas as queries

O script atualizará/criará:
- Tabela `atividades` (com novos campos: data_hora, limite_vagas, id_profissional)
- Tabela `inscricoes` (nova - para gerenciar inscrições de alunos)
- Índices para melhor performance

## Passo 2: Inserir Dados de Teste (Opcional)

Se quiser popular com atividades de teste, execute este SQL:

```sql
INSERT INTO atividades (nome, descricao, data_hora, limite_vagas, id_profissional)
VALUES
  (
    'Yoga para Iniciantes',
    'Aula introdutória de yoga para quem está começando. Aprenda as posições básicas e técnicas de respiração.',
    '2026-06-15T10:00:00',
    5,
    1
  ),
  (
    'Musculação - Peito e Costas',
    'Treino intenso focado no fortalecimento do peito e costas. Ideal para intermediários.',
    '2026-06-16T14:00:00',
    10,
    1
  ),
  (
    'Pilates Avançado',
    'Aula avançada de pilates para melhorar flexibilidade e core.',
    '2026-06-17T09:00:00',
    8,
    1
  ),
  (
    'Cardio HIIT',
    'Treino cardiovascular de alta intensidade. Traga sua energia!',
    '2026-06-18T17:30:00',
    12,
    1
  ),
  (
    'Alongamento e Flexibilidade',
    'Sessão relaxante de alongamento para recuperação muscular.',
    '2026-06-19T18:00:00',
    15,
    1
  );
```

## Passo 3: Iniciar o Backend

Na pasta `backend/`:

```bash
npm install  # Se ainda não instalou as dependências
npm start    # Ou npm run dev
```

O servidor rodará em `http://localhost:3000`

## Passo 4: Iniciar o Frontend

Na pasta `frontend/`:

```bash
npm install  # Se ainda não instalou as dependências
npm run dev  # Para desenvolvimento
```

O frontend rodará em `http://localhost:5173`

## Passo 5: Testar os Endpoints

### Criar uma Atividade

```bash
curl -X POST http://localhost:3000/api/atividades \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Yoga para Iniciantes",
    "descricao": "Aula de yoga para quem está começando",
    "data_hora": "2026-06-15T10:00:00",
    "limite_vagas": 5,
    "id_profissional": 1
  }'
```

### Listar Atividades

```bash
curl -X GET http://localhost:3000/api/atividades
```

### Inscrever em uma Atividade

```bash
curl -X POST http://localhost:3000/api/atividades/1/inscricoes \
  -H "Content-Type: application/json" \
  -d '{
    "id_aluno": 2
  }'
```

### Ver Inscritos em uma Atividade

```bash
curl -X GET http://localhost:3000/api/atividades/1/inscricoes
```

### Cancelar Inscrição

```bash
curl -X DELETE http://localhost:3000/api/atividades/1/inscricoes/2
```

## Verificação de Funcionamento

- [x] Tabelas SQL criadas/atualizadas em `backend/src/database/tables.sql`
- [x] Backend rodando em port 3000
- [x] Frontend rodando em port 5173 
- [x] Endpoints respondendo corretamente
- [x] UI interativa (inscrever, cancelar, expandir detalhes)
- [x] Validação de limite de vagas
- [x] Estilos seguem padrão da aplicação

## Arquivos Criados/Modificados

### Backend (Novos):
- `backend/src/models/Atividade.js`
- `backend/src/models/Inscricao.js`
- `backend/src/services/atividadeService.js`
- `backend/src/services/inscricaoService.js`
- `backend/src/controllers/atividadeController.js`
- `backend/src/routes/atividadeRoutes.js`

### Frontend (Novos):
- `frontend/src/views/AgendamentoAtividades.vue`
- `frontend/src/services/atividadeService.js`

### Modificados:
- `backend/src/database/tables.sql` (tabelas atividades e inscricoes adicionadas)
- `backend/src/index.js` (import de atividadeRoutes)
- `frontend/src/App.vue` (para exibir AgendamentoAtividades)


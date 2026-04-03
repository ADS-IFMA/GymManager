<script setup>
import { ref } from 'vue'

const nome = ref('')
const email = ref('')
const senha = ref('')
const mensagem = ref('')
const erro = ref('')

const registrarAluno = async () => {
  erro.value = ''
  mensagem.value = ''

  if (!nome.value || !email.value || !senha.value) {
    erro.value = 'Preencha todos os campos.'
    return
  }

  try {
    const response = await fetch('http://localhost:3000/api/alunos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: nome.value, email: email.value, senha: senha.value })
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao cadastrar aluno')
    }

    mensagem.value = `Aluno ${data.aluno.nome} cadastrado com sucesso!`;
    nome.value = ''
    email.value = ''
    senha.value = ''
  } catch (e) {
    erro.value = e.message
  }
}
</script>

<template>
  <section>
    <h1>Cadastro de Aluno</h1>
    <form @submit.prevent="registrarAluno">
      <div>
        <label for="nome">Nome</label><br />
        <input id="nome" v-model="nome" type="text" placeholder="Nome completo" required />
      </div>

      <div>
        <label for="email">E-mail</label><br />
        <input id="email" v-model="email" type="email" placeholder="email@exemplo.com" required />
      </div>

      <div>
        <label for="senha">Senha</label><br />
        <input id="senha" v-model="senha" type="password" placeholder="Senha" required />
      </div>

      <button type="submit">Cadastrar Aluno</button>
    </form>

    <div v-if="mensagem" style="margin-top: 1rem; color: #0a0;">{{ mensagem }}</div>
    <div v-if="erro" style="margin-top: 1rem; color: #a00;">{{ erro }}</div>
  </section>
</template>


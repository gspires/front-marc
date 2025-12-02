<template>
    <TabelaPadrao titulo="Profissionais" :columns="columns" :rows="rows" :loading="carregando" label-btn="ADICIONAR"
        btn-add="/cadastro-profissional" btn-alterar-prefix="/update-profissional/">
    </TabelaPadrao>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useProfissionais } from 'src/composables/useProfissionais'
import TabelaPadrao from '../partials/tablePadrao.vue'

const { findProfissionais } = useProfissionais()

const carregando = ref(false)
const rows = ref([])
const columns = [
    {
        name: 'index',
        label: '#',
        field: 'index'
    },
    { name: 'nome', align: 'left', label: 'Nome', field: 'nome', sortable: true },
    { name: 'cpf', label: 'CPF', field: 'cpf', sortable: true },
    { name: 'registroConselho', label: 'Registro no conselho', field: 'registroConselho' },
    { name: 'telefone', label: 'Telefone', field: 'telefone' },
    { name: 'email', label: 'Email', field: 'email' },
    { name: 'especialidade', label: 'Especialidade', field: 'especialidade' },
    { name: 'acoes', label: 'Ações', field: 'acoes' }
]

onMounted(async () => {

    try {
        const profissionais = await findProfissionais()
        //-------------------------Lista de profissionais----------------------------------------//
        rows.value = profissionais.data.map((item, index) => ({
            ...item,
            index: index + 1
        }))
    } catch (error) {
        console.error('Erro ao listar Profissionais', error)
    }
})

</script>
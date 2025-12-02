<template>
    <TabelaPadrao titulo="Serviços" :columns="columns" :rows="rows" :loading="carregando" label-btn="ADICIONAR"
        btn-add="/cadastro-servico" btn-alterar-prefix="/update-servico/" :mostrarRelatorio="true">
    </TabelaPadrao>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useServicos } from 'src/composables/useServicos'
import TabelaPadrao from '../partials/tablePadrao.vue'

const { findServicos } = useServicos()

const carregando = ref(false)
const rows = ref([])
const columns = [
    {
        name: 'index',
        label: '#',
        field: 'index'
    },
    { name: 'descricao', align: 'left', label: 'Descrição', field: 'descricao', sortable: true },
    { name: 'duracaoMinutos', label: 'duração', field: 'duracaoMinutos', sortable: true },
    { name: 'valor', label: 'Investimento', field: 'valor' },
    { name: 'status', label: 'Status', field: 'status' },
    { name: 'acoes', label: 'Ações', field: 'acoes' }
]

onMounted(async () => {


    try {
        const servicos = await findServicos()
        //-------------------------Lista de servicos----------------------------------------//
        rows.value = servicos.data.map((item, index) => ({
            index: index + 1,
            ...item
        }))
    } catch (error) {
        console.error('Erro ao listar receitas:', error)
    }
})



</script>
<template>
    <TabelaPadrao titulo="Pacientes" :columns="columns" :rows="rows" :loading="carregando" label-btn="ADICIONAR"
        btn-add="/cadastro" btn-alterar-prefix="/update-paciente/">
        <template v-slot:body-cell-historico="props">
            <q-td :props="props">
                <q-btn dense round flat icon="list" text-color="orange" :to="`/historico-paciente/${props.row.id}`" />
            </q-td>
        </template>
    </TabelaPadrao>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { usePaciente } from 'src/composables/usePacientes'
import { format } from 'date-fns';
import TabelaPadrao from '../partials/tablePadrao.vue'

const { findPacientes } = usePaciente()

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
    { name: 'dataNascimento', label: 'Data de nascimento', field: 'dataNascimento' },
    { name: 'telefone', label: 'Telefone', field: 'telefone' },
    { name: 'email', label: 'Email', field: 'email' },
    { name: 'endereco', label: 'Endereço', field: 'endereco' },
    { name: 'dataCadastro', label: 'Data de cadastro', field: 'dataCadastro' },
    { name: 'historico', label: 'Historico', field: 'historico' },
    { name: 'acoes', label: 'Ações', field: 'acoes' }
]

onMounted(async () => {


    try {
        const paciente = await findPacientes()
        //-------------------------Lista de pacientes----------------------------------------//
        rows.value = paciente.data.map((item, index) => ({
            ...item,
            dataNascimento: item.dataNascimento ? format(new Date(item.dataNascimento), 'dd/MM/yyyy') : '',
            dataCadastro: item.dataCadastro ? format(new Date(item.dataCadastro), 'dd/MM/yyyy') : '',
            index: index + 1
        }))
    } catch (error) {
        console.error('Erro ao listar receitas:', error)
    }
})



</script>
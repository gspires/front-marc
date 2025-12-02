<template>
    <div class="q-pa-md">
        <TabelaPadrao titulo="Consultas" :columns="columns" :rows="rows" :loading="carregando"
            label-btn="MARCAR CONSULTA" btn-add="/marcar-consulta" btn-alterar-prefix="/update-consulta/"
            @abrirStatus="abrirStatus" :mostrar-status="true" :options-filter="service" label-filter="Serviços"
            @atualizar="filtrarConsultas" label-filter-status="Status">
            <template v-slot:body-cell-relatorio="props">
                <q-td :props="props">
                    <q-btn dense round flat icon="article" text-color="green" @click="abrirConsulta(props.row)" />
                </q-td>
            </template>
        </TabelaPadrao>
    </div>
    <BoxStatus v-model="DialogStatus" :status-atual="statusSelecionado" :id-consulta="idSelecionado"
        @status-atualizado="listarConsultas" />
    <BoxRelatorio v-model="DialogConsulta" :consulta="consultaSelecionada" />


</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useConsulta } from 'src/composables/useConsulta'
import { useServicos } from 'src/composables/useServicos'
import { format, parseISO } from 'date-fns';
import BoxStatus from 'src/components/consulta/boxStatus.vue'
import BoxRelatorio from '../boxs/BoxRelatorio.vue';
import TabelaPadrao from 'src/components/partials/tablePadrao.vue'

const { findConsultas } = useConsulta()
const { findServicos } = useServicos()

const statusSelecionado = ref(null)
const idSelecionado = ref(null)
const consultaSelecionada = ref(null)
const DialogStatus = ref(false)
const DialogConsulta = ref(false)
const rows = ref([])
const service = ref([])
const carregando = ref(false)
const columns = [
    {
        name: 'index',
        label: '#',
        field: 'index'
    },
    { name: 'paciente', align: 'left', label: 'Paciente', field: 'paciente', sortable: true },
    { name: 'profissional', label: 'Profissional', field: 'profissional', sortable: true },
    { name: 'servico', label: 'Serviço', field: 'servico' },
    { name: 'data', label: 'Data', field: 'data' },
    { name: 'horaInicio', label: 'Hora', field: 'horaInicio' },
    { name: 'status', label: 'Status', field: 'status' },
    { name: 'observacoes', label: 'Observações', field: 'observacoes' },
    { name: 'relatorio', label: 'Relatório', field: 'relatorio' },
    { name: 'acoes', label: 'Ações', field: 'acoes' }
]

async function buscarConsulta() {
    const consulta = await findConsultas()
    let lista = consulta.data.map((item, index) => ({
        ...item,
        paciente: item.paciente.nome,
        profissional: item.profissional.nome,
        servico: item.servico.descricao,
        data: item.data ? format(new Date(item.data), 'dd/MM/yyyy') : '',
        horaInicio: item.horaInicio ? format(parseISO(item.horaInicio), 'HH:mm') : '',
        index: index + 1
    }))
    return lista
}

async function listarConsultas() {


    try {
        //-------------------------Lista de Consultas----------------------------------------//
        let lista = await buscarConsulta()
        lista = lista.filter(c => c.status !== "REALIZADO")
        rows.value = lista
        //-------------------------Filtros de Consultas----------------------------------------//
        const servicos = await findServicos()
        service.value = servicos.data.map(s => ({
            label: s.descricao,
            value: s.id
        }))
    } catch (error) {
        console.error('Erro ao listar receitas:', error)
    }
}


async function filtrarConsultas({ servico, status }) {
    try {
        carregando.value = true
        let lista = await buscarConsulta()
        if (servico) {
            lista = lista.filter(c => c.servico === servico.label)
        }

        if (status) {
            lista = lista.filter(c => c.status === status)
        }

        rows.value = lista
    } catch (error) {
        console.error('Erro ao filtrar consultas:', error)
    } finally {
        carregando.value = false
    }
}

onMounted(() => {
    listarConsultas()
})

async function abrirConsulta(row) {
    consultaSelecionada.value = row
    DialogConsulta.value = true
}

function abrirStatus(row) {
    statusSelecionado.value = row.status
    idSelecionado.value = row.id
    DialogStatus.value = true
}

</script>
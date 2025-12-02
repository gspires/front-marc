<template>
    <div class="q-pa-md">
        <q-table style="height: 400px" flat bordered :title="titulo" :rows="rows" :columns="columns" row-key="index"
            virtual-scroll :rows-per-page-options="[0]" @request="onRequest">
            <template v-slot:top-right>
                <div class="row items-center">
                    <q-select v-if="labelFilter" class="select q-mr-sm" filled v-model="model" :options="optionsFilter"
                        dense :label="labelFilter" style="height: 42px; min-width: 200px;" />
                    <q-select v-if="labelFilterStatus" class="select q-mr-sm" filled v-model="modelStatus"
                        :options="optionsFilterStatus" dense :label="labelFilterStatus"
                        style="height: 42px; min-width: 200px;" />
                    <q-btn color="primary" icon="add" :label="labelBtn" :to="btnAdd"
                        style="height: 42px; min-width: 200px;" />
                </div>
            </template>
            <template v-slot:body-cell-acoes="props">
                <q-td :props="props">
                    <q-btn dense round flat icon="edit" text-color="green"
                        :to="btnAlterarPrefix + props.row.id"></q-btn>
                    <q-btn v-if="mostrarStatus" dense round flat icon="update" text-color="blue"
                        @click="$emit('abrirStatus', props.row)" />
                    <q-btn v-if="mostrarRelatorio" dense round flat icon="assignment_add" text-color="blue"
                        :to="`/cadastro-relatorio/${props.row.id}`" />
                </q-td>
            </template>
            <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
                <slot :name="name" v-bind="slotProps" />
            </template>
        </q-table>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue'

defineProps({
    titulo: String,
    columns: {
        type: Array,
        required: true
    },
    rows: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    labelBtn: String,
    btnAdd: String,
    btnAlterarPrefix: String,
    mostrarStatus: {
        type: Boolean,
        default: false
    },
    mostrarRelatorio: {
        type: Boolean,
        default: false
    },
    optionsFilter: {
        type: Array
    },
    labelFilter: String,


    labelFilterStatus: String







})


const optionsFilterStatus = ['AGENDADO', 'CONFIRMADO', 'REALIZADO', 'CANCELADO']



const emit = defineEmits(['atualizar', 'abrirStatus'])
const filtro = ref('')
const model = ref(null)
const modelStatus = ref(null)
const pagination = ref({ page: 1, rowsPerPage: 10 })

function onRequest(props) {
    emit('atualizar', { filtro: filtro.value, servico: model.value, pagination: props.pagination })
}

watch(model, (novoValor) => {
    emit('atualizar', {
        filtro: filtro.value,
        servico: novoValor,
        status: modelStatus.value,
        pagination: pagination.value
    })
})

watch(modelStatus, (novoStatus) => {
    emit('atualizar', {
        filtro: filtro.value,
        servico: model.value,
        status: novoStatus,
        pagination: pagination.value
    })
})
</script>
<style scoped>
.select {
    border: none;
    background-color: rgb(240, 238, 238);
    border-radius: 5px;
}
</style>
<template>
    <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
        <q-card style="min-width: 350px">
            <q-card-section class="text-h6">
                Alterar status da consulta
            </q-card-section>

            <q-card-section>
                <q-select filled v-model="consulta.status" :options="statusOptions" label="Selecione o novo status" />
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="negative" @click="fechar" />
                <q-btn flat label="Salvar" color="primary" @click="salvar" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits, reactive } from 'vue'
import { useConsulta } from 'src/composables/useConsulta'
import { useQuasar } from 'quasar';

const $q = useQuasar();
const { updateConsulta } = useConsulta()


const props = defineProps({
    modelValue: Boolean,
    statusAtual: String,
    idConsulta: Number
})

const emit = defineEmits(['update:modelValue', 'status-atualizado'])
const consulta = reactive({
    status: props.statusAtual
})

const selectedId = ref(props.idConsulta)
watch(() => props.statusAtual, (novo) => {
    consulta.status = novo
})

watch(() => props.idConsulta, (novo) => {
    selectedId.value = novo
})

const statusOptions = [
    'AGENDADO',
    'CONFIRMADO',
    'REALIZADO',
    'CANCELADO'
]

function fechar() {
    emit('update:modelValue', false)
}

async function salvar() {
    const response = await updateConsulta(selectedId.value, consulta)

    if (response.success) {
        emit('status-atualizado')
        $q.notify({
            position: 'top',
            color: 'positive',
            textColor: 'white',
            icon: 'cloud_done',
            message: response.message
        });
    } else {
        $q.notify({
            position: 'top',
            color: 'negative',
            textColor: 'white',
            icon: 'error',
            message: response.message
        });
    }

    fechar()
}
</script>

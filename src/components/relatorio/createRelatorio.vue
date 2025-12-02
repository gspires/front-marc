<template>
    <q-page class="q-pa-md">
        <div class="text-h6 q-mb-md">Cadastro de Serviço</div>

        <q-form @submit.prevent="submitForm" class="q-gutter-md">

            <div v-for="(campo, index) in campos" :key="index" class="campo q-pa-sm q-mb-md bordered rounded-borders">
                <q-input filled v-model="campo.nome" label="Descreva o nome" class="q-pa-sm" />
                <q-input filled v-model="campo.label" label="Descreva o label" class="q-pa-sm" />
                <q-input filled v-model="campo.tipo" label="Descreva o tipo" class="q-pa-sm" />
                <hr>
                <div class="q-mt-sm">
                    <q-btn flat color="negative" label="Remover" @click="removerCampo(index)" size="sm" />
                </div>
            </div>
            <hr>
            <div class="q-mt-md">
                <q-btn color="secondary" label="Adicionar campo" @click="adicionarCampo" icon="add" class="q-mr-sm" />
                <q-btn label="Cadastrar" type="submit" color="primary" />
            </div>
        </q-form>
    </q-page>
    {{ relatorio }}
</template>

<script setup>
import { useServicoRelatorio } from 'src/composables/useServicoRelatorio'
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router'
import { onMounted, reactive, ref } from 'vue';

const route = useRoute()
const router = useRouter()
const { createServicoRelatorio, findServicoRelatorio, updateServicoRelatorio } = useServicoRelatorio()
const $q = useQuasar();

const campos = ref([
    { nome: '', label: '', tipo: '' }
])
const relatorio = reactive({
    servicoId: null,
    estrutura: {
        campos: []
    }
})

const servicoId = Number(route.params.id)
const verificacao = ref(false)

onMounted(async () => {
    const response = await findServicoRelatorio(servicoId)
    if (response?.data?.servicoId) {
        verificacao.value = true
        Object.assign(relatorio, response.data)
        if (response.data.estrutura?.campos?.length) {
            campos.value = response.data.estrutura.campos
        }
    } else {
        console.log('Nenhum relatório encontrado para este serviço')
    }
})

const adicionarCampo = () => {
    campos.value.push({ nome: '', label: '', tipo: '' })
}

const removerCampo = (index) => {
    campos.value.splice(index, 1)
}

async function submitForm() {
    relatorio.servicoId = servicoId
    relatorio.estrutura.campos = campos.value
    if (verificacao.value === false) {
        console.log('já tem ')
        const response = await createServicoRelatorio(relatorio)
        if (response.success) {
            router.push('/servicos')
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
    } else {
        const dataToSend = {
            servicoId: relatorio.servicoId,
            estrutura: relatorio.estrutura
        }
        const response = await updateServicoRelatorio(servicoId, dataToSend)
        console.log(relatorio)
        if (response.success) {
            router.push('/servicos')
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
    }

}
</script>
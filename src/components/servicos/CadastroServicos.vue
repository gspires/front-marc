<template>
    <q-page class="q-pa-md">
        <div class="text-h6 q-mb-md">Cadastro de Serviço</div>

        <q-form @submit.prevent="submitForm" class="q-gutter-md">
            <q-input filled v-model="servico.descricao" label="Descreva o serviço" />
            <q-input filled v-model="servico.duracaoMinutos" label="Duração do serviço" />
            <q-input filled v-model="servico.valor" label="Investimento no serviço" />
            <q-select filled v-model="servico.status" :options="statusServico" label="Status" />
            <div>
                <q-btn label="Cadastrar" type="submit" color="primary" />
            </div>
        </q-form>
    </q-page>
</template>
<script setup>
import { reactive } from 'vue';
import { useServicos } from 'src/composables/useServicos'
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router'

const router = useRouter()
const { createServico } = useServicos()
const $q = useQuasar();

const statusServico = ['ATIVO', 'DESATIVO']

const servico = reactive({
    descricao: null,
    duracaoMinutos: null,
    valor: null,
    status: null
})

async function submitForm() {

    const servicoToSend = { ...servico }
    servicoToSend.duracaoMinutos = Number(servicoToSend.duracaoMinutos)
    servicoToSend.valor = Number(servicoToSend.valor)
    const response = await createServico(servicoToSend)
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
</script>
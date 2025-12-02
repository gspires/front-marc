<template>
    <q-page class="q-pa-md">
        <div class="text-h6 q-mb-md">Alteração de Pacientes</div>

        <q-form @submit.prevent="submitForm" class="q-gutter-md">
            <q-input filled v-model="servico.descricao" label="Descreva o serviço" />
            <q-input filled v-model="servico.duracaoMinutos" label="Duração do serviço" />
            <q-input filled v-model="servico.valor" label="Investimento no serviço" />
            <q-select filled v-model="servico.status" :options="statusServico" label="Status" />
            <div>
                <q-btn label="ALTERAR" type="submit" color="primary" />
            </div>
        </q-form>
    </q-page>
</template>
<script setup>
import { onMounted, reactive } from 'vue';
import { useServicos } from 'src/composables/useServicos'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar';

const route = useRoute()
const router = useRouter()
const $q = useQuasar();

const statusServico = ['ATIVO', 'DESATIVO']

const servicoId = route.params.id

const { findServico, updateServico } = useServicos();

const servico = reactive({
    descricao: null,
    duracaoMinutos: null,
    valor: null,
    status: null
})


onMounted(async () => {
    try {
        const response = await findServico(servicoId)
        Object.assign(servico, response.data)
    } catch (error) {
        console.error('Erro ao buscar serviço:', error)
    }

})

const submitForm = async () => {
    try {
        const servicoToSend = { ...servico }
        servicoToSend.valor = Number(servicoToSend.valor)
        delete servicoToSend.id

        const response = await updateServico(servicoId, servicoToSend)
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
    } catch (error) {
        console.error('Erro ao buscar paciente:', error)
    }




}

</script>
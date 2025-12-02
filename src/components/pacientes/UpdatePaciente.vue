<template>
    <q-page class="q-pa-md">
        <div class="text-h6 q-mb-md">Alteração de Pacientes</div>

        <q-form @submit.prevent="submitForm" class="q-gutter-md">
            <q-input filled v-model="paciente.nome" label="Digite o nome" />
            <q-input filled v-model="paciente.cpf" label="Digite o CPF" />
            <q-input filled v-model="paciente.telefone" label="Digite o telefone" />
            <q-input filled v-model="paciente.email" label="Digite o email" />
            <q-input filled v-model="paciente.endereco" label="Digite o endereço" />
            <q-input filled v-model="paciente.dataNascimento" label="Data de Nascimento" type="date" />
            <div>
                <q-btn label="Cadastrar" type="submit" color="primary" />
            </div>
        </q-form>
    </q-page>
</template>
<script setup>
import { onMounted, reactive } from 'vue';
import { usePaciente } from 'src/composables/usePacientes';
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar';
import { parseISO } from 'date-fns';

const route = useRoute()
const router = useRouter()
const $q = useQuasar();

const pacienteId = route.params.id


const { findPaciente, updatePaciente } = usePaciente();

const paciente = reactive({
    nome: null,
    cpf: null,
    dataNascimento: null,
    telefone: null,
    email: null,
    endereco: null
})


onMounted(async () => {
    try {
        const response = await findPaciente(pacienteId)
        const data = response.data
        if (data.dataNascimento) {
            data.dataNascimento = data.dataNascimento.split('T')[0]
        }

        Object.assign(paciente, data)
    } catch (error) {
        console.error('Erro ao buscar paciente:', error)
    }

})

const submitForm = async () => {
    try {
        const pacienteToSend = { ...paciente }

        delete pacienteToSend.id
        delete pacienteToSend.dataCadastro
        pacienteToSend.cpf = pacienteToSend.cpf?.replace(/\D/g, '') || ''
        pacienteToSend.telefone = pacienteToSend.telefone?.replace(/\D/g, '') || ''

        if (pacienteToSend.dataNascimento) {
            pacienteToSend.dataNascimento = parseISO(pacienteToSend.dataNascimento).toISOString();
        }
        console.log(pacienteToSend)
        const response = await updatePaciente(pacienteId, pacienteToSend)
        if (response.success) {
            router.push('/pacientes')
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
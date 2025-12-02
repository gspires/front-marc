<template>
    <q-page class="q-pa-md">
        <div class="text-h6 q-mb-md">Cadastro de Pacientes</div>

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
import { reactive } from 'vue';
import { usePaciente } from 'src/composables/usePacientes';
import { useQuasar } from 'quasar';
import { parseISO } from 'date-fns';
import { useRouter } from 'vue-router'

const router = useRouter()
const { createPaciente } = usePaciente()
const $q = useQuasar();

const paciente = reactive({
    nome: null,
    cpf: null,
    dataNascimento: null,
    telefone: null,
    email: null,
    endereco: null
})

async function submitForm() {

    const pacienteToSend = { ...paciente }

    pacienteToSend.cpf = pacienteToSend.cpf?.replace(/\D/g, '') || ''
    pacienteToSend.telefone = pacienteToSend.telefone?.replace(/\D/g, '') || ''

    if (pacienteToSend.dataNascimento) {
        pacienteToSend.dataNascimento = parseISO(pacienteToSend.dataNascimento).toISOString();
    }
    const response = await createPaciente(pacienteToSend)

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
}
</script>
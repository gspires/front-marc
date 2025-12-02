<template>
    <q-page class="q-pa-md">
        <div class="text-h6 q-mb-md">Alteração de Pacientes</div>

        <q-form @submit.prevent="submitForm" class="q-gutter-md">
            <q-input filled v-model="profissional.nome" label="Digite o nome" />
            <q-input filled v-model="profissional.cpf" label="Digite o CPF" />
            <q-input filled v-model="profissional.registroConselho" label="Digite o registro do conselho" />
            <q-input filled v-model="profissional.telefone" label="Digite o telefone" />
            <q-input filled v-model="profissional.email" label="Digite o email" />
            <q-input filled v-model="profissional.especialidade" label="Digite o especialidade" />
            <div>
                <q-btn label="Cadastrar" type="submit" color="primary" />
            </div>
        </q-form>
    </q-page>
</template>
<script setup>
import { onMounted, reactive } from 'vue';
import { useProfissionais } from 'src/composables/useProfissionais';
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar';

const route = useRoute()
const router = useRouter()
const $q = useQuasar();

const profissionalId = route.params.id

const { findProfissional, updateProfissional } = useProfissionais();

const profissional = reactive({
    nome: null,
    cpf: null,
    registroConselho: null,
    telefone: null,
    email: null,
    especialidade: null
})


onMounted(async () => {
    try {
        const response = await findProfissional(profissionalId)

        Object.assign(profissional, response.data)
    } catch (error) {
        console.error('Erro ao buscar paciente:', error)
    }

})

const submitForm = async () => {
    try {
        const profissionalToSend = { ...profissional }
        delete profissionalToSend.id
        const response = await updateProfissional(profissionalId, profissionalToSend)
        if (response.success) {
            router.push('/profissionais')
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
        console.error('Erro ao buscar profissional:', error)
    }




}

</script>
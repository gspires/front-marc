<template>
    <q-page class="q-pa-md">
        <div class="text-h6 q-mb-md">Cadastro de Profissional</div>

        <q-form @submit.prevent="submitForm" class="q-gutter-md">
            <q-input filled v-model="profissional.nome" label="Digite o nome" />
            <q-input filled v-model="profissional.cpf" label="Digite o CPF" />
            <q-input filled v-model="profissional.registroConselho" label="Digite o registro do conselho" />
            <q-input filled v-model="profissional.telefone" label="Digite o telefone" />
            <q-input filled v-model="profissional.email" label="Digite o email" />
            <q-input filled v-model="profissional.especialidade" label="Digite o especialidade" />
            <q-input filled v-model="profissional.password" label="Digite sua senha" type="password" />
            <div>
                <q-btn label="Cadastrar" type="submit" color="primary" />
            </div>
        </q-form>
    </q-page>
</template>
<script setup>
import { reactive } from 'vue';
import { useProfissionais } from 'src/composables/useProfissionais';
import { useUsers } from 'src/composables/useUsers';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router'

const router = useRouter()
const { createProfissional } = useProfissionais()
const { createUser } = useUsers()
const $q = useQuasar();

const profissional = reactive({
    nome: null,
    cpf: null,
    registroConselho: null,
    telefone: null,
    email: null,
    especialidade: null,
    password: null
})

async function submitForm() {
    try {
        const profissionalToSend = { ...profissional }
        delete profissionalToSend.password
        const profi = await createProfissional(profissionalToSend)
        console.log(profi)
        const { ...user } = profissional

        user.role = 'profissional'
        user.profissionalId = profi.data.id
        user.name = user.nome

        delete user.registroConselho
        delete user.especialidade
        delete user.telefone
        delete user.nome

        console.log(user)
        const response = await createUser(user)
        console.log(response)

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

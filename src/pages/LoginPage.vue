<template>
    <q-layout view="lHh Lpr lFf">
        <q-page-container>
            <q-page class="row items-center justify-center full-height">

                <q-card class="q-ma-md" style="max-width: 1000px;" flat bordered>

                    <q-card-section horizontal class="row items-stretch">

                        <q-card-section class="col-md-7 gt-sm bg-grey-2 flex flex-center">
                            <img src="src/assets/img/capa-login.png" alt="Imagem de Capa para Login" class="q-pa-xl"
                                style="max-width: 100%; height: auto; object-fit: contain;">
                        </q-card-section>

                        <q-card-section class="col-12 col-md-5 bg-blue-9 flex column justify-center q-pa-lg">

                            <div class="text-white q-gutter-y-lg q-pa-md">

                                <div class="text-center">
                                    <q-icon name="lock" size="xl" class="q-mb-sm" />
                                    <div class="text-h5 text-weight-bold">Acesso ao Sistema</div>
                                </div>

                                <q-form greedy @submit.prevent="onLogin" class="q-gutter-y-md">

                                    <q-input v-model="email" label="Usuário" bg-color="white" filled dense
                                        label-color="blue-grey-4" :rules="['email']">
                                        <template v-slot:prepend>
                                            <q-icon name="person" color="blue-grey-6" />
                                        </template>
                                    </q-input>

                                    <q-input v-model="senha" type="password" label="Senha" bg-color="white" filled dense
                                        label-color="blue-grey-4" :rules="['password']">
                                        <template v-slot:prepend>
                                            <q-icon name="vpn_key" color="blue-grey-6" />
                                        </template>
                                    </q-input>

                                    <div class="q-pt-md">
                                        <q-btn type="submit" label="Entrar" color="white" text-color="blue-9" unelevated
                                            class="full-width q-mb-sm" size="lg" />
                                        <q-btn label="Esqueceu a Senha?" flat text-color="white" class="full-width"
                                            size="sm" />
                                    </div>
                                </q-form>
                            </div>
                        </q-card-section>
                    </q-card-section>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const senha = ref('')
const router = useRouter()
const auth = useAuthStore()

const onLogin = async () => {
    try {
        await auth.login(email.value, senha.value)
        router.push('/')
    } catch (err) {
        console.error(err)
    }
}
</script>
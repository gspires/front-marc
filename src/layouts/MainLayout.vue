<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>
          Sistema de Fisioterapia
        </q-toolbar-title>
        <q-btn flat dense round icon="logout" @click="logout" class="q-ml-sm" />
      </q-toolbar>
    </q-header>

    <!-- MENU LATERAL -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item clickable v-ripple to="/consulta">
          <q-item-section avatar><q-icon name="event" /></q-item-section>
          <q-item-section>Agenda</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/pacientes">
          <q-item-section avatar><q-icon name="people" /></q-item-section>
          <q-item-section>Pacientes</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/servicos">
          <q-item-section avatar><q-icon name="healing" /></q-item-section>
          <q-item-section>Serviços</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/profissionais">
          <q-item-section avatar><q-icon name="work" /></q-item-section>
          <q-item-section>Profissionais</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/dashboard">
          <q-item-section avatar><q-icon name="analytics" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const leftDrawerOpen = ref(false)
const auth = useAuthStore()

const logout = async () => {
  try {
    await auth.logout()
    router.push('/login')
  } catch (err) {
    console.error(err)
  }
}

</script>

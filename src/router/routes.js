import { useAuthStore } from 'src/stores/auth'

const requireAuth = (to, from, next) => {
  const auth = useAuthStore()
  if (!auth.token) next('/login')
  else next()
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: requireAuth,
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'consulta',
        name: 'consulta',
        component: () => import('components/consulta/PaginaConsulta.vue'),
        children: [
          {
            path: '',
            name: 'ListaConsulta',
            component: () => import('components/consulta/ListaConsulta.vue'),
          },
          {
            path: '/marcar-consulta',
            name: 'MarcarConsulta',
            component: () => import('components/consulta/MarcarConsulta.vue'),
          },
          {
            path: '/update-consulta/:id',
            name: 'updateConsulta',
            component: () => import('components/consulta/updateConsulta.vue'),
          }
        ]
      },
      {
        path: 'pacientes',
        name: 'pacientes',
        component: () => import('components/pacientes/PaginaPacientes.vue'),
        children: [
          {
            path: '',
            name: 'ListaPaciente',
            component: () => import('components/pacientes/ListaPaciente.vue'),
          },
          {
            path: '/cadastro',
            name: 'cadastroPaciente',
            component: () => import('components/pacientes/CadastroPaciente.vue'),
          },
          {
            path: '/update-paciente/:id',
            name: 'updatePaciente',
            component: () => import('components/pacientes/UpdatePaciente.vue'),
          },
          {
            path: '/historico-paciente/:id',
            name: 'historicoPaciente',
            component: () => import('components/partials/historicoPaciente.vue'),
          }

        ]
      },
      {
        path: 'servicos',
        name: 'servicos',
        component: () => import('components/servicos/PaginaServicos.vue'),
        children: [
          {
            path: '',
            name: 'ListaServicos',
            component: () => import('components/servicos/ListaServicos.vue')
          },
          {
            path: '/update-servico/:id',
            name: 'updateServicos',
            component: () => import('components/servicos/UpdateServicos.vue')
          },
          {
            path: '/cadastro-servico',
            name: 'addServicos',
            component: () => import('components/servicos/CadastroServicos.vue')
          },
          {
            path: '/cadastro-relatorio/:id',
            name: 'addRelatorio',
            component: () => import('components/relatorio/createRelatorio.vue')
          }
        ]
      },
      {
        path: '/dashboard',
        name: 'addRelatorio',
        component: () => import('components/dashboard/dashPrincipal.vue')
      },
      {
        path: 'profissionais',
        name: 'profissionais',
        component: () => import('components/profissionais/PaginaProfissional.vue'),
        children: [
          {
            path: '',
            name: 'lista-profissionais',
            component: () => import('components/profissionais/ListaProfissionais.vue'),
          },
          {
            path: '/update-profissional/:id',
            name: 'update-profissionais',
            component: () => import('components/profissionais/UpdateProfissional.vue'),
          },
          {
            path: '/cadastro-profissional',
            name: 'cadastroProfissional',
            component: () => import('components/profissionais/CadastroProfissional.vue'),
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('src/pages/LoginPage.vue')
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

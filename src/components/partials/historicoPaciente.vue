<template>
    <div class="q-pa-md">
        <q-card class="q-pa-lg shadow-3 rounded-borders">
            <div class="row items-center q-mb-md">
                <q-icon name="account_circle" size="48px" color="primary" class="q-mr-md" />
                <div>
                    <div class="text-h6 text-primary">Detalhes do Paciente</div>
                    <div class="text-subtitle2 text-grey">
                        Histórico e informações pessoais
                    </div>
                </div>
            </div>

            <q-separator spaced />

            <div v-if="historico?.data" class="q-mt-md">
                <q-list bordered separator>
                    <q-item>
                        <q-item-section>
                            <q-item-label overline>NOME</q-item-label>
                            <q-item-label>{{ historico.data[0].paciente.nome }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item v-if="historico.data[0].paciente.cpf">
                        <q-item-section>
                            <q-item-label overline>CPF</q-item-label>
                            <q-item-label>{{ historico.data[0].paciente.cpf }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item v-if="historico.data[0].paciente.telefone">
                        <q-item-section>
                            <q-item-label overline>Telefone</q-item-label>
                            <q-item-label>{{ historico.data[0].paciente.telefone }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>

                <div class="q-mt-lg text-center">
                    <q-btn color="primary" icon="history" label="Ver Histórico de Consultas" outline
                        @click="mostrarHistorico = !mostrarHistorico" class="q-mb-md" />
                </div>

                <q-list class="q-gutter-md" v-if="mostrarHistorico">
                    <q-card v-for="consulta in historico.data" :key="consulta.id" class="shadow-4 rounded-borders">

                        <q-card-section class="bg-blue-grey-1 q-py-sm">
                            <div class="row items-center q-col-gutter-lg">

                                <div class="col-12 col-sm-4">
                                    <div class="text-caption text-blue-grey-8">PROFISSIONAL</div>
                                    <div class="text-subtitle1 text-weight-medium text-primary">
                                        {{ consulta.profissional.nome }}
                                    </div>
                                </div>

                                <div class="col-12 col-sm-4">
                                    <div class="text-caption text-blue-grey-8">SERVIÇO</div>
                                    <div class="text-subtitle1 text-weight-medium text-primary">
                                        {{ consulta.servico.descricao }}
                                    </div>
                                </div>

                                <div class="col-12 col-sm-4">
                                    <div class="text-caption text-blue-grey-8">DATA DA CONSULTA</div>
                                    <div class="text-subtitle1 text-weight-medium text-primary">
                                        {{ new Date(consulta.data).toLocaleDateString('pt-BR') }}
                                    </div>
                                </div>
                            </div>
                        </q-card-section>

                        <q-card-section v-if="consulta?.relatorio?.data?.dados" class="q-pt-md">

                            <div class="row items-center q-mb-sm">
                                <q-icon name="description" color="indigo" size="xs" class="q-mr-xs" />
                                <div class="text-subtitle2 text-indigo text-weight-bold">RELATÓRIO DO SERVIÇO</div>
                                <q-space />
                                <q-chip size="sm" icon="done_all" color="green-6" text-color="white">
                                    REALIZADO
                                </q-chip>
                            </div>

                            <q-separator spaced="sm" />

                            <div class="q-pa-sm bg-grey-1 rounded-borders">
                                <div class="row q-col-gutter-sm">
                                    <div v-for="(valor, chave, index) in consulta.relatorio.data.dados || consulta.relatorio.data"
                                        :key="index" class="col-12 col-sm-6">
                                        <div class="text-caption text-grey-7">{{ chave }}</div>
                                        <div class="text-body2 text-dark">{{ valor || 'Não informado' }}</div>
                                    </div>
                                </div>
                            </div>

                        </q-card-section>

                        <q-card-section v-else class="bg-red-1 q-pa-sm">
                            <div class="text-caption text-red-8 text-weight-medium text-center">
                                Relatório pendente ou não aplicável.
                            </div>
                        </q-card-section>

                    </q-card>
                </q-list>

                <div style="display: flex; justify-content: flex-end;" class="no-print">
                    <q-btn class="q-mt-md float-right" color="primary" icon="print" label="Imprimir"
                        @click="imprimirRelatorio" />
                </div>


            </div>

            <div v-else class="text-grey text-center q-mt-md">
                <q-icon name="hourglass_empty" size="md" color="grey" />
                <div>Carregando dados do paciente...</div>
            </div>
        </q-card>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useConsulta } from 'src/composables/useConsulta';
import { useRelatorio } from 'src/composables/useRelatorio';
import { useRoute } from 'vue-router'

const route = useRoute()

const { consultaHistorico } = useConsulta()
const { findRelatorio } = useRelatorio()
const historico = ref()
const mostrarHistorico = ref(false)
const consultaId = route.params.id
onMounted(async () => {
    historico.value = await consultaHistorico(consultaId)
    loucura()
})


async function loucura() {
    for (let i = 0; i < historico.value.data.length; i++) {
        historico.value.data[i].relatorio = await findRelatorio(historico.value.data[i].id)
    }
}
function imprimirRelatorio() {
    window.print()
}
</script>
<template>
    <q-dialog :model-value="modelValue" @update:model-value="fecharRelatorio" persistent>
        <q-card class="q-pa-lg shadow-3 rounded-borders" style="max-width: 700px; width: 95%;">
            <div class="row items-center justify-between q-mb-md">
                <div class="text-h6 text-primary flex items-center">
                    <q-icon name="description" size="md" class="q-mr-sm" />
                    Relatório da Consulta
                </div>
                <q-btn dense flat icon="close" color="negative" @click="fecharRelatorio(false)" />
            </div>
            <q-card-section class="bg-grey-2 rounded-borders q-pa-md q-mb-md">
                <div class="text-body1 q-mb-xs">
                    <strong>Paciente:</strong> {{ consulta.paciente }}
                </div>
                <div class="text-body1">
                    <strong>Serviço:</strong> {{ consulta.servico }}
                </div>
            </q-card-section>
            <div v-if="relatorios?.data?.id" class="q-mt-md">
                <q-card flat bordered class="q-pa-md bg-grey-1 rounded-borders shadow-2">
                    <div class="row items-center justify-between q-mb-md">
                        <div class="text-h6 text-primary flex items-center">
                            <q-icon name="description" size="sm" class="q-mr-sm" />
                            Relatório do Serviço
                        </div>
                        <q-chip color="primary" text-color="white" icon="medical_services">
                            {{ consulta.servico }}
                        </q-chip>
                    </div>

                    <q-separator spaced />
                    <div class="q-mt-md q-gutter-md">
                        <div class="q-pa-sm bg-white shadow-1">
                            <div v-for="(valor, chave, index) in relatorios.data.dados || relatorios.data" :key="index">
                                <label class="text-subtitle2 text-primary">{{ chave }}: </label>
                                <span class="text-body2 text-grey-8">{{ valor || '—' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="row justify-end q-mt-md">
                        <q-btn color="primary" icon="print" label="Imprimir" @click="imprimirRelatorio" />
                    </div>
                </q-card>
            </div>
            <div v-else>
                <q-form @submit.prevent="emitirRelatorio" class="q-gutter-md">
                    <div v-if="relatorio?.data?.estrutura?.campos" class="q-gutter-md">
                        <div v-for="(campo, index) in relatorio.data.estrutura.campos" :key="index"
                            class="q-pa-md bg-grey-1 rounded-borders shadow-1">
                            <div class="text-subtitle1 text-weight-medium text-primary q-mb-xs">
                                {{ campo.label }}
                            </div>

                            <q-input v-if="campo.tipo === 'texto'" v-model="campo.valor" filled outlined dense
                                placeholder="Digite aqui..." :label="campo.label" />

                            <q-input v-else-if="campo.tipo === 'numero'" v-model.number="campo.valor" type="number"
                                filled outlined dense placeholder="Digite um valor numérico" :label="campo.label" />

                            <q-input v-else-if="campo.tipo === 'area'" v-model="campo.valor" type="textarea" autogrow
                                filled outlined dense placeholder="Descreva aqui..." :label="campo.label" />

                            <q-select v-else-if="campo.tipo === 'select'" v-model="campo.valor" :options="campo.opcoes"
                                filled outlined dense emit-value map-options :label="campo.label"
                                placeholder="Selecione uma opção" />

                            <div v-else class="text-grey-6 text-italic q-ml-sm">
                                Tipo de campo desconhecido
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        {{ relatorio.data }}
                    </div>
                    <div class="row justify-end q-mt-md q-gutter-sm">
                        <q-btn flat color="negative" label="Cancelar" @click="fecharRelatorio(false)" />
                        <q-btn color="primary" label="Salvar Relatório" type="submit" />
                    </div>
                </q-form>
            </div>
        </q-card>
    </q-dialog>
</template>


<script setup>
import { ref, watch, reactive } from 'vue'
import { useServicoRelatorio } from 'src/composables/useServicoRelatorio'
import { useRelatorio } from 'src/composables/useRelatorio'
import { useConsulta } from 'src/composables/useConsulta'
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router'

const router = useRouter()
const $q = useQuasar();


const { updateConsulta } = useConsulta();
const { findServicoRelatorio } = useServicoRelatorio()
const { createServicoConsulta, findRelatorio } = useRelatorio()
const relatorio = ref({ data: { estrutura: { campos: [] } } })
const relatorios = ref()
const relatorioConsulta = reactive({
    consultaId: null,
    servicoRelatorioId: null,
    dados: {}
})


const props = defineProps({
    consulta: {
        type: Object,
        default: () => { }
    },
    modelValue: {
        type: Boolean
    }
})

const emit = defineEmits(['update:modelValue', 'salvar'])



watch(
    () => props.modelValue,
    async (isDialogOpen) => {
        if (isDialogOpen && props.consulta.id) {
            relatorio.value = await findServicoRelatorio(props.consulta.servicoId)
            relatorios.value = await findRelatorio(props.consulta.id)
        }
    }
)


async function emitirRelatorio() {
    const dadosCampos = {}
    relatorio.value.data.estrutura.campos.forEach((campo) => {
        dadosCampos[campo.label] = campo.valor ?? null
    })
    relatorioConsulta.dados = dadosCampos
    relatorioConsulta.consultaId = props.consulta.id
    relatorioConsulta.servicoRelatorioId = relatorio.value.data.id
    const responseRelatorio = await createServicoConsulta(relatorioConsulta)
    if (responseRelatorio.success) {

        const consultaAtualizada = {
            status: 'REALIZADO'

        }
        const response = await updateConsulta(props.consulta.id, consultaAtualizada)
        if (response.success) {
            router.push('/consulta')
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
    } else {
        $q.notify({
            position: 'top',
            color: 'negative',
            textColor: 'white',
            icon: 'error',
            message: responseRelatorio.message
        });
    }
}
function fecharRelatorio(valor) {
    emit('update:modelValue', valor);
}
function imprimirRelatorio() {
    window.print()
}
</script>

<style scoped>
.rounded-borders {
    border-radius: 16px;
}
</style>

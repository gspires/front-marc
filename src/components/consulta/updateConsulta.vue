<template>
    <q-page class="q-pa-md">
        <div class="text-h6 q-mb-md">Marcar Consulta</div>

        <q-form @submit.prevent="submitForm" class="q-gutter-md">
            <q-select filled map-options v-model="consulta.pacienteId" :options="selectPaciente"
                label="Selecione o paciente" disable />

            <q-select filled v-model="consulta.profissionalId" :options="selectProfissionais" map-options
                label="Selecione o profissional" />

            <q-select filled v-model="consulta.servicoId" :options="selectServicos" label="Selecione o serviço"
                map-options />

            <q-input v-model="consulta.observacoes" filled type="textarea" label="Observações" />

            <div class="q-pa-md" style="max-width: 400px">
                <div class="row q-col-gutter-sm">
                    <div class="col">
                        <q-input filled v-model="consulta.data" label="Data" readonly>
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="consulta.data" mask="YYYY-MM-DD">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Fechar" color="primary" flat />
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                    </div>
                    <div class="col">
                        <q-input filled v-model="consulta.horaInicio" label="Hora" readonly>
                            <template v-slot:append>
                                <q-icon name="access_time" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-time v-model="consulta.horaInicio" format24h>
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Fechar" color="primary" flat />
                                            </div>
                                        </q-time>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                    </div>
                </div>
            </div>
            <div>
                <q-btn label="Alterar" type="submit" color="primary" />
            </div>
        </q-form>
    </q-page>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useConsulta } from 'src/composables/useConsulta'
import { usePaciente } from 'src/composables/usePacientes'
import { useProfissionais } from 'src/composables/useProfissionais'
import { useServicos } from 'src/composables/useServicos'
import { format, parseISO } from 'date-fns'
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const $q = useQuasar();
const route = useRoute()

const { findServicos, findServico } = useServicos()
const { findPacientes } = usePaciente()
const { findProfissionais } = useProfissionais()
const { findConsulta, updateConsulta } = useConsulta()

const consulta = reactive({
    pacienteId: null,
    profissionalId: null,
    servicoId: null,
    data: null,
    horaInicio: null,
    horaFim: null,
    status: null,
    observacoes: null
})


const consultaId = route.params.id

const selectPaciente = ref([])
const selectProfissionais = ref([])
const selectServicos = ref([])

onMounted(async () => {

    const response = await findConsulta(consultaId)
    const pacientes = await findPacientes()
    selectPaciente.value = pacientes.data.map(p => ({
        label: p.nome,
        value: p.id
    }))

    const profissionais = await findProfissionais()
    selectProfissionais.value = profissionais.data.map(p => ({
        label: p.nome,
        value: p.id
    }))

    const servicos = await findServicos()
    selectServicos.value = servicos.data.map(p => ({
        label: p.descricao,
        value: p.id
    }))


    if (response.data.data) {
        response.data.data = response.data.data.split('T')[0]
    }
    if (response.data.horaInicio) {
        response.data.horaInicio = format(parseISO(response.data.horaInicio), 'HH:mm')
    }

    Object.assign(consulta, response.data)

})

async function submitForm() {
    const consultaToSend = { ...consulta }

    if (consultaToSend.data) {
        consultaToSend.data = parseISO(consultaToSend.data).toISOString();
    }


    if (!consultaToSend.data || consultaToSend.horaInicio) {

        const dataHoraInicio = new Date(`${consulta.data}T${consulta.horaInicio}`)
        let servico = await findServico(consulta.servico.id)
        const duracao = servico.data.duracaoMinutos || 0
        const dataHoraFim = new Date(dataHoraInicio.getTime() + duracao * 60000)
        consultaToSend.horaInicio = dataHoraInicio.toISOString()
        consultaToSend.horaFim = dataHoraFim.toISOString()
    }
    console.log(consultaToSend)

    consultaToSend.profissionalId = consultaToSend.profissionalId.value
    consultaToSend.servicoId = consultaToSend.servicoId.value
    delete consultaToSend.paciente
    delete consultaToSend.profissional
    delete consultaToSend.servico
    delete consultaToSend.id

    console.log(consultaToSend)

    const response = await updateConsulta(consulta.id, consultaToSend)
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
}
</script>
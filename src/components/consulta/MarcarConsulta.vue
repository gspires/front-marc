<template>
    <q-page class="q-pa-md">
        <div class="text-h6 q-mb-md">Marcar Consulta</div>

        <q-form @submit.prevent="submitForm" class="q-gutter-md">
            <q-select filled v-model="consulta.pacienteId" :options="selectPaciente" label="Selecione o paciente" />

            <q-select filled v-model="consulta.profissionalId" :options="selectProfissionais"
                label="Selecione o profissional" />

            <q-select filled v-model="consulta.servicoId" :options="selectServicos" label="Selecione o serviço" />

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
                <q-btn label="Agendar" type="submit" color="primary" />
            </div>
        </q-form>
        <div class="text-h6 q-mb-md">
            Horários indisponíveis — {{ formatarData(consulta.data) }}
        </div>
        <q-card v-if="bloqueados.length" class="q-pa-md">
            <div class="text-subtitle2 q-mb-sm">Esses horários já estão ocupados:</div>

            <div class="row q-col-gutter-sm">
                <q-chip v-for="(b, i) in bloqueados" :key="i" color="red-4" text-color="white" class="q-mb-sm">
                    {{ b.horaInicio }} - {{ b.horaFim }}
                </q-chip>
            </div>
        </q-card>

        <q-card v-else class="q-pa-md bg-green-1 text-green-9">
            Nenhum horário ocupado para este dia 🎉
        </q-card>
    </q-page>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { usePaciente } from 'src/composables/usePacientes'
import { useProfissionais } from 'src/composables/useProfissionais'
import { useServicos } from 'src/composables/useServicos'
import { useConsulta } from 'src/composables/useConsulta'
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router'
import { parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale'

const router = useRouter()
const $q = useQuasar();

const { findServicos, findServico } = useServicos()
const { findPacientes } = usePaciente()
const { findProfissionais } = useProfissionais()
const { createConsulta, findConsultas } = useConsulta()

const consulta = reactive({
    pacienteId: null,
    profissionalId: null,
    servicoId: null,
    data: null,
    horaInicio: null,
    horaFim: null,
    status: 'AGENDADO'
})

const bloqueados = ref([])

function formatarData(data) {
    if (!data) return ''
    return format(new Date(data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

const selectPaciente = ref([])
const selectProfissionais = ref([])
const selectServicos = ref([])
const consultas = ref([])

onMounted(async () => {

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
})

watch(
    () => [consulta.profissionalId, consulta.data],
    async ([profissional, data]) => {
        if (profissional && data) {
            await horaLivre()
        } else {
            bloqueados.value = []
        }
    }
)


async function horaLivre() {
    const consultaToSend = { ...consulta };

    if (consultaToSend.data) {
        consultaToSend.data = parseISO(consultaToSend.data).toISOString();
    }

    if (consultaToSend.pacienteId) {
        consultaToSend.pacienteId = consultaToSend.pacienteId.value;
    }
    if (consultaToSend.profissionalId) {
        consultaToSend.profissionalId = consultaToSend.profissionalId.value;
    }
    if (consultaToSend.servicoId) {
        consultaToSend.servicoId = consultaToSend.servicoId.value;
    }

    if (consultaToSend.data && consultaToSend.horaInicio) {
        const dataHoraInicio = new Date(`${consulta.data}T${consulta.horaInicio}`);
        const servico = await findServico(consulta.servicoId.value);
        const duracao = servico.data.duracaoMinutos || 0;
        const dataHoraFim = new Date(dataHoraInicio.getTime() + duracao * 60000);

        consultaToSend.horaInicio = dataHoraInicio.toISOString();
        consultaToSend.horaFim = dataHoraFim.toISOString();
    }

    console.log("Nova consulta:", consultaToSend);
    consultas.value = await findConsultas();

    bloqueados.value = consultas.value.data
        .filter((c) => {
            const mesmoProfissional = c.profissionalId === consultaToSend.profissionalId
            const dataConsultaExistente = new Date(c.horaInicio).toISOString().split('T')[0]
            const dataConsultaSelecionada = new Date(consultaToSend.data).toISOString().split('T')[0]

            const mesmaData = dataConsultaExistente === dataConsultaSelecionada
            return mesmoProfissional && mesmaData
        })
        .map((c) => ({
            horaInicio: format(new Date(c.horaInicio), 'HH:mm'),
            horaFim: format(new Date(c.horaFim), 'HH:mm'),
        }))


}












async function submitForm() {
    const consultaToSend = { ...consulta }
    if (consultaToSend.data) {
        consultaToSend.data = parseISO(consultaToSend.data).toISOString();
    }

    if (consultaToSend.pacienteId) {
        consultaToSend.pacienteId = consultaToSend.pacienteId.value
    }
    if (consultaToSend.profissionalId) {
        consultaToSend.profissionalId = consultaToSend.profissionalId.value
    }
    if (consultaToSend.servicoId) {
        consultaToSend.servicoId = consultaToSend.servicoId.value
    }

    if (!consultaToSend.data || consultaToSend.horaInicio) {
        const dataHoraInicio = new Date(`${consulta.data}T${consulta.horaInicio}`)
        let servico = await findServico(consulta.servicoId.value)
        const duracao = servico.data.duracaoMinutos || 0
        const dataHoraFim = new Date(dataHoraInicio.getTime() + duracao * 60000)
        consultaToSend.horaInicio = dataHoraInicio.toISOString()
        consultaToSend.horaFim = dataHoraFim.toISOString()
    }


    const conflito = consultas.value.data.some((c) => {
        if (c.profissionalId !== consultaToSend.profissionalId) return false;
        const inicioExistente = new Date(c.horaInicio);
        const fimExistente = new Date(c.horaFim);
        const inicioNovo = new Date(consultaToSend.horaInicio);
        const fimNovo = new Date(consultaToSend.horaFim);
        return inicioNovo < fimExistente && fimNovo > inicioExistente;
    });

    if (conflito) {
        console.warn("⚠️ Já existe uma consulta nesse horário!");
        $q.notify({
            position: 'top',
            color: 'negative',
            textColor: 'white',
            icon: 'error',
            message: "Horário indisponível para este profissional."
        });
        return { conflito: true, message: "Horário indisponível para este profissional." }
    } else {
        const response = await createConsulta(consultaToSend)
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

}
</script>
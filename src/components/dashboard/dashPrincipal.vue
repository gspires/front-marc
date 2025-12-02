<template>
    <div class="q-pa-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="q-pa-md">
            <q-select v-model="mesSelecionado" :options="meses" label="Selecione o mês" emit-value map-options
                @update:modelValue="carregarDashboard" />
        </div>
        <div class="p-4 rounded-2xl shadow-md row justify-between">
            <BoxFinanceiro class="q-my-md" titulo="Total recebido" cor="green" :valor=valorTotal />
            <BoxFinanceiro class="q-my-md" titulo="Total de cliente" cor="blue" :valor=qtdClientes />
            <BoxFinanceiro class="q-my-md" titulo="Consultas" cor="gray" :valor=qtdTotal />
        </div>



        <q-card class="p-4 rounded-2xl shadow-md">
            <div class="text-lg font-semibold mb-2">Consultas por Serviço</div>
            <apexchart type="bar" height="300" :options="chartServicos.options" :series="chartServicos.series" />
        </q-card>
        <div class="q-mt-sm p-4 rounded-2xl shadow-md row justify-between">
            <q-card>
                <div class="text-lg font-semibold mb-2">Status das Consultas</div>
                <div class="grafico-container">
                    <apexchart v-if="chartStatus.series.length > 0" type="donut" :options="chartStatus.options"
                        :series="chartStatus.series"></apexchart>

                    <div v-else>Carregando dados do status...</div>
                </div>
            </q-card>
            <q-card>
                <div class="text-lg font-semibold mb-2">Por serviço</div>
                <div class="grafico-container">
                    <apexchart v-if="financeiroServico.series.length > 0" type="donut"
                        :options="financeiroServico.options" :series="financeiroServico.series"></apexchart>

                    <div v-else>Carregando dados do status...</div>
                </div>
            </q-card>
            <q-card>
                <div class="text-lg font-semibold mb-2">Status das Consultas</div>
                <div class="grafico-container">
                    <apexchart v-if="chartStatus.series.length > 0" type="donut" :options="chartStatus.options"
                        :series="chartStatus.series"></apexchart>

                    <div v-else>Carregando dados do status...</div>
                </div>
            </q-card>

        </div>




    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useConsulta } from 'src/composables/useConsulta'
import BoxFinanceiro from '../boxs/BoxFinanceiro.vue'

const valorTotal = ref()
const qtdTotal = ref()
const qtdClientes = ref()

const meses = [
    { label: "Geral", value: "geral" },
    { label: "Janeiro", value: 1 },
    { label: "Fevereiro", value: 2 },
    { label: "Março", value: 3 },
    { label: "Abril", value: 4 },
    { label: "Maio", value: 5 },
    { label: "Junho", value: 6 },
    { label: "Julho", value: 7 },
    { label: "Agosto", value: 8 },
    { label: "Setembro", value: 9 },
    { label: "Outubro", value: 10 },
    { label: "Novembro", value: 11 },
    { label: "Dezembro", value: 12 }
];

const mesSelecionado = ref(new Date().getMonth() + 1);

const apexchart = VueApexCharts

const { resumoStatus, resumoServico, resumoFinanceiro, findClientes } = useConsulta();

const chartStatus = ref({
    series: [],
    options: {
        labels: [],
        legend: { position: 'bottom' }
    }
})

const financeiroServico = ref({
    series: [],
    options: {
        labels: [],
        legend: { position: 'bottom' }
    }
})


const chartServicos = ref({
    series: [{
        name: 'Consultas',
        data: []
    }],
    options: {
        chart: { toolbar: { show: false } },
        xaxis: { categories: [] }
    }
})




onMounted(async () => {
    carregarDashboard()
})

async function carregarDashboard() {
    console.log("Mês mudou para:", mesSelecionado.value)
    const mes = mesSelecionado.value === "geral" ? null : mesSelecionado.value;
    const ano = new Date().getFullYear();

    const status = await resumoStatus(mes, ano)

    const financeiro = await resumoFinanceiro(mes, ano)
    const resClientes = await findClientes(mes, ano)

    qtdClientes.value = resClientes.data
    valorTotal.value = financeiro.valorTotal
    qtdTotal.value = financeiro.qtdTotal

    chartStatus.value.series = Object.values(status).map(item => item.status)
    chartStatus.value.options.labels = Object.keys(status)

    financeiroServico.value.series = financeiro.resumoDetalhado.map(item => item.subtotal)
    financeiroServico.value.options.labels = financeiro.resumoDetalhado.map(item => item.descricao)

    const servico = await resumoServico(mes, ano)

    chartServicos.value.series = [
        { name: "Total", data: servico.map(s => s.total) }
    ]

    chartServicos.value.options = {
        ...chartServicos.value.options,
        xaxis: { categories: servico.map(s => s.descricao) }
    }
}


</script>

<style scoped>
.grafico-container {
    width: 300px;
    height: 300px;
    margin: 0 auto;
}
</style>
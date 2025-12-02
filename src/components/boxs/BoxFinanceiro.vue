<template>
    <div class="box-finaceiro" :style="{ backgroundColor: cor }">
        <strong style="color: rgb(200, 200, 200);">Titulo :</strong> <span> {{ titulo }}</span><br>
        <strong style="color: rgb(200, 200, 200);">Valor :</strong> <span> {{ valor }}</span><br>
    </div>
</template>
<script setup>


defineProps({
    titulo: String,
    cor: {
        type: String,
        default: '#00BCD4'
    },
    valor: Number
})
</script>

<style scoped>
.box-finaceiro {
    padding: 5px;
    border-radius: 5px;
    color: white;
    width: 32%;
    background-color: aqua;
}
</style>
<template>
    <iframe class="iframe" :src="url" frameborder="0"></iframe>
</template>

<script setup lang="ts">
defineProps<{
    url: string
}>()
</script>

<style>
.iframe {
    width: 100%;
    height: 86vh;
}
</style>

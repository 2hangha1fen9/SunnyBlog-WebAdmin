<template>
    <svg class="svg-icon" aria-hidden="true">
        <use :xlink:href="iconName" />
    </svg>
</template>

<script setup lang="ts">
import { computed } from "vue"
const props = defineProps<{
    iconClass: string
}>()

const iconName = computed(() => `#icon-${props.iconClass}`)
</script>

<style scoped>
.svg-icon {
    width: 1.6em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>
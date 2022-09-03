<template>
    <el-card class="card">
        <EditorPanel :isAdd="true"></EditorPanel>
    </el-card>
</template>

<script setup lang="ts">
import EditorPanel from "./components/EditorPanel.vue"
</script>

<style scoped>
.card {
    max-width: 500px;
}
</style>

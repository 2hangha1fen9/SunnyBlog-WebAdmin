<template>
    <el-container direction="vertical" class="main-container">
        <!-- 头部 -->
        <Header></Header>
        <!-- 主页 -->
        <el-main class="main">
            <router-view v-slot="{ Component }">
                <transition name="fade-transform" mode="out-in" appear>
                    <component :key="key" :is="Component" />
                </transition>
            </router-view>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import Header from "./Header.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const key = computed(() => route.path)
</script>

<style scoped>
.main-container {
    position: relative;
    min-height: 100%;
    background-color: rgb(246, 248, 249);
}
.main {
    width: 100%;
    position: relative;
    overflow: hidden;
}
</style>
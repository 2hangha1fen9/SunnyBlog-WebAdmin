<template>
    <el-avatar :src="photo" size="default" class="d" />
    <p class="d">{{ username }}</p>
    <el-button round class="d" @click="logout">Logout</el-button>
</template>

<script setup lang="ts">
import { useStore } from "vuex"
import { useRouter, useRoute } from "vue-router"
const store = useStore()
const router = useRouter()
const route = useRoute()
defineProps({
    photo: {
        type: String,
        default: "",
    },
    username: {
        type: String,
        default: "小张",
    },
})

function logout() {
    store.dispatch("identity/logout")
    router.push(`/login?redirect=${route.fullPath}`)
}
</script>

<style>
.d {
    margin: 5px;
}
</style>
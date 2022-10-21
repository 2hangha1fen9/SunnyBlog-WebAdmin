<template>
    <nav class="nav">
        <div class="nav-item">
            <!-- 侧边栏按钮 -->
            <Hamburger :is-active="sidebar.opened" @toggleClick="toggleSideBar" />
            <el-switch v-model="isDark" class="dark-btn" :inactive-icon="Sunny" :active-icon="Moon" :inline-prompt="true" />
            <!-- 面包屑导航 -->
            <Breadcrumb class="breadcrumb-container"></Breadcrumb>
        </div>
        <div class="nav-item">
            <!-- 头像 -->
            <Avatar :photo="photo" :username="username"></Avatar>
        </div>
    </nav>
</template>

<script setup lang="ts">
import Hamburger from "@/components/Hamburger.vue"
import Breadcrumb from "@/components/Breadcrumb.vue"
import Avatar from "@/components/Avatar.vue"
import { useStore } from "vuex"
import { computed, getCurrentInstance, watch } from "vue"
import { Sunny, Moon } from "@element-plus/icons-vue"
import { useDark, useToggle } from "@vueuse/core"

const isDark = useDark()
const store = useStore() //使用vuex
const instance = getCurrentInstance()

const sidebar = computed(() => store.getters["app/sidebar"]) //获取vuex getter
const username = computed(() => store.getters["identity/username"])
const photo = computed(() => store.getters["identity/photo"])

//切换方法
function toggleSideBar() {
    store.dispatch("app/toggleSideBar")
}

//监听黑暗模式变化
watch(isDark, (newVal) => {
    instance?.proxy?.$bus.emit("switchDark", newVal)
})
</script>

<style scpoed>
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--el-menu-item-height);
    overflow: hidden;
    background: var(--el-bg-color);
    -webkit-box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}
.nav-item {
    height: var(--el-menu-item-height);
    display: flex;
    align-items: center;
    justify-content: center;
}
.breadcrumb-container {
    float: left;
}

.dark-btn {
    margin: 10px;
    --el-switch-on-color: var(--el-mask-color-extra-light);
}
</style>

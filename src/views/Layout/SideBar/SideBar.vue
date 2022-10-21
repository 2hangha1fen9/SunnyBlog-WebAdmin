<template>
    <nav class="side-container">
        <el-scrollbar max-height="100%">
            <el-menu router class="menu" :default-active="route.path" :collapse="sidebar.opened">
                <el-menu-item index="/" class="logo" style="color: var(--el-text-color-primary); background-color: none">
                    <el-icon>
                        <svg-icon class="sub-el-icon" icon-class="sunny" />
                    </el-icon>
                    <span>SunnyBlog</span>
                </el-menu-item>
                <Menu v-for="route in routes" :item="route" :key="route.path"></Menu>
            </el-menu>
        </el-scrollbar>
    </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { useStore } from "vuex"
import { computed, onMounted, onUnmounted } from "vue"
import Menu from "./Menu.vue"

const store = useStore()
const sidebar = computed(() => store.getters["app/sidebar"]) //获取vuex getter 侧边栏状态

const route = useRoute()
const router = useRouter()

const routes = computed(() => router.options.routes)

onMounted(() => {
    //响应式配置
    addEventListener("resize", collspaseAdide)
})

//收起侧边栏
collspaseAdide()
function collspaseAdide() {
    if (document.documentElement.clientWidth <= 1200) {
        store.dispatch("app/setStatus", true)
    } else {
        store.dispatch("app/setStatus", false)
    }
}

onUnmounted(() => {
    removeEventListener("resize", collspaseAdide)
})
</script>

<style scoped>
.side-container {
    z-index: 1000;
    position: sticky;
    height: 100vh;
    top: 0;
    background-color: var(--el-bg-color);
    -webkit-box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    box-shadow: 0 1px 14px rgb(0 21 41 / 8%);
}

.menu {
    border-right: none;
    height: 100%;
    overflow: auto;
}

.menu:not(.el-menu--collapse) {
    width: 210px;
}

/* 修复切换卡顿 */
.horizontal-collapse-transition {
    transition: 0.4s width ease-in-out, 0.4s padding-left ease-in-out, 0.4s padding-right ease-in-out;
}

.el-menu-hover-bg-color:not(.logo) {
    background-color: var(--el-color-primary-light-9);
}
</style>

<template>
    <nav class="nav">
        <div class="nav-item">
            <!-- 侧边栏按钮 -->
            <Hamburger :is-active="sidebar.opened" @toggleClick="toggleSideBar" />
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
import { computed } from "vue"

const store = useStore() //使用vuex

const sidebar = computed(() => store.getters["app/sidebar"]) //获取vuex getter
const username = computed(() => store.getters["identity/username"])
const photo = computed(() => store.getters["identity/photo"])

//切换方法
function toggleSideBar() {
    store.dispatch("app/toggleSideBar")
}
</script>

<style scpoed>
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--el-menu-item-height);
    overflow: hidden;
    background: #fff;
    -webkit-box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}
.nav-item {
    height: var(--el-menu-item-height);
    display: flex;
    align-items: center;
}
.breadcrumb-container {
    float: left;
}
</style>

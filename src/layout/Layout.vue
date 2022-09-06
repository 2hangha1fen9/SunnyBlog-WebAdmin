<template>
    <div class="common-layout">
        <el-container>
            <!-- 侧边栏 -->
            <SideBar class="side-m"></SideBar>
            <!-- 主窗口 -->
            <Main class="main-m"></Main>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import Main from "./Main/Main.vue"
import SideBar from "./SideBar/SideBar.vue"
</script>

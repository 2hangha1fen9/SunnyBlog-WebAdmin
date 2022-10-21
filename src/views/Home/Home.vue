<template>
    <div class="home">
        <div class="row-panel">
            <el-card class="dashboard-card">
                <el-collapse v-model="activeName">
                    <el-collapse-item name="1">
                        <template #title>
                            <svg-icon iconClass="article" class="card-icon"></svg-icon>
                            <h3>文章总览</h3>
                        </template>
                        <ArticleCountPanel />
                    </el-collapse-item>
                    <el-collapse-item title="" name="2">
                        <template #title>
                            <svg-icon iconClass="comment" class="card-icon"></svg-icon>
                            <h3>评论总览</h3>
                        </template>
                        <CommentCountPanel />
                    </el-collapse-item>
                    <el-collapse-item name="3">
                        <template #title>
                            <svg-icon iconClass="userlist" class="card-icon"></svg-icon>
                            <h3>用户总览</h3>
                        </template>
                        <UserCountPanel />
                    </el-collapse-item>
                    <el-collapse-item name="4">
                        <template #title>
                            <svg-icon iconClass="auth" class="card-icon"></svg-icon>
                            <h3>权限总览</h3>
                        </template>
                        <PermissionCountPenel />
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </div>
        <div class="row-panel">
            <UserTrendPenel />
            <ArticleTrendPanel />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import UserTrendPenel from "./components/UserTrendPenel.vue"
import UserCountPanel from "./components/UserCountPanel.vue"
import ArticleTrendPanel from "./components/ArticleTrendPanel.vue"
import ArticleCountPanel from "./components/ArticleCountPanel.vue"
import CommentCountPanel from "./components/CommentCountPanel.vue"
import PermissionCountPenel from "./components/PermissionCountPenel.vue"

const activeName = ref("1")
</script>

<style scoped>
.home {
    width: 100%;
    height: 100%;
}
.dashboard-card {
    margin: 0px 10px 10px 0px;
    flex-grow: 1;
    width: 50%;
}
.row-panel {
    display: flex;
    width: 100%;
    justify-content: space-between;
}

.dashboard-card >>> .el-collapse-item__header {
    padding: 10px;
}
.card-icon {
    width: 30px;
    height: 30px;
    color: var(--el-color-white);
    background-color: var(--el-color-primary-light-3);
    padding: 7px;
    border-radius: 16px;
    box-shadow: var(--el-box-shadow-lighter);
    margin: 10px 10px 10px 0px;
}
</style>

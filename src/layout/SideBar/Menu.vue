<template>
    <!-- 如果路由有子级 -->
    <el-sub-menu v-if="item.children && item.children.length && !item.meta.hidden" :index="item.path">
        <template #title>
            <el-icon>
                <svg-icon v-if="item.meta.icon" :icon-class="item.meta.icon" />
            </el-icon>

            <span>{{ item.meta.title }} </span>
        </template>
        <!-- 遍历子级 -->
        <Menu v-for="chlid in item.children" :item="chlid" :key="chlid.path"></Menu>
    </el-sub-menu>
    <!-- 路由没有子级 -->
    <el-menu-item v-else-if="!item.meta.hidden" :index="item.path">
        <el-icon>
            <svg-icon v-if="item.meta.icon" :icon-class="item.meta.icon" />
        </el-icon>
        <template #title>
            <span>{{ item.meta.title }}</span>
        </template>
    </el-menu-item>
</template>

<script setup lang="ts">
defineProps<{
    // eslint-disable-next-line no-undef
    item: RouteRecordRaw
}>()
</script>

<template>
    <ul class="count-view">
        <li>
            <h4>权限总数</h4>
            <p>{{ state.permissionCount || 0 }}</p>
        </li>
        <li>
            <h4>启用权限</h4>
            <p>{{ state.enablePermissionCount || 0 }}</p>
        </li>
        <li>
            <h4>禁用权限</h4>
            <p>{{ state.disablePermissionCount || 0 }}</p>
        </li>
        <li>
            <h4>角色总数</h4>
            <p>{{ state.roleCount || 0 }}</p>
        </li>
        <li>
            <h4>启用角色</h4>
            <p>{{ state.enableRoleCount || 0 }}</p>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { Response } from "@/interface/common/response"
import { PermissionCountStatistics } from "@/interface/identity/statistics"
import { getPermisssionCount } from "@/api/identity/statistics"

const state = ref<UserCountStatistics>({})

getPermisssionCount().then((data: Response<PermissionCountStatistics>) => {
    if (data.status === 200) {
        state.value = data.result
    }
})
</script>

<style scoped>
.count-view {
    padding-inline-start: 0px;
    display: flex;
    list-style-type: none;

    align-items: center;
    flex-wrap: wrap;
}
.count-view li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    white-space: nowrap !important;
    padding: 20px;
}
.count-view li p {
    font-size: 30px;
}
</style>

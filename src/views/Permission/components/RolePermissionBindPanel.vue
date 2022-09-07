<template>
    <el-transfer
        v-model="state"
        filterable="true"
        :props="{
            key: 'id',
            label: 'description',
        }"
        :data="allPermission"
        :titles="['所有权限', `${role.name}的权限`]"
        :format="{
            noChecked: '${total}',
            hasChecked: '${total}',
        }"
        :button-texts="['解绑', '绑定']"
        class="transfer"
    />
    <div class="submit">
        <el-button type="primary" :loading="btnLoading" @click="saveRolePermission">提交</el-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { ElMessage } from "element-plus"
//接口
import { Response, PageBean } from "@/interface/common/response"
import { Permission } from "@/interface/identity/permission"
import { Role } from "@/interface/identity/role"
//api
import { listPermission, listRolePermission}from "@/api/identity/permission"
import { rolePermissionBind } from "@/api/identity/relation"

const props = defineProps<{
    role: Role
}>()
const emits = defineEmits<{
    (event: "closeDialog"): void
}>()

const btnLoading = ref(false)
const role = ref(props.role)
//角色权限ID
const state = ref<Array<number>>([])
//所有权限
const allPermission = ref<Array<Permission>>([])

//查询角色权限信息
function queryRolePermission() {
    listRolePermission(role.value.id).then((data: Response<PageBean<Array<Permission>>>) => {
        if (data.status !== 200) {
            ElMessage.warning("数据拉取失败")
        }
        data.result.page.forEach((item: Permissions) => {
            state.value.unshift(item.id)
        })
    })
}
//查询所有权限
function queryListPermission() {
    listPermission(null, -1, []).then((data: Response<PageBean<Array<Permission>>>) => {
        if (data.status !== 200) {
            ElMessage.warning("数据拉取失败")
        }
        data.result.page.forEach((item: Permission) => {
            allPermission.value.unshift({
                id: item.id,
                description: `${item.description} /${item.service}/${item.controller}/${item.action}`,
            })
        })
    })
}
//保存角色权限绑定
function saveRolePermission() {
    btnLoading.value = true
    rolePermissionBind({
        roleId: role.value.id,
        permissionIds: state.value,
    }).then((data: Response<string>) => {
        if (data.status !== 200) {
            ElMessage.warning(data.message)
        } else {
            ElMessage.success("操作成功")
            emits("closeDialog")
        }
        btnLoading.value = false
    })
}

queryRolePermission()
queryListPermission()
</script>

<style scoped>
.submit {
    margin: 10px;
    display: flex;
    justify-content: flex-end;
}
.transfer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
}
.transfer >>> .el-transfer__buttons {
    display: flex;
}
.transfer >>> .el-transfer-panel {
    width: 50%;
}
</style>

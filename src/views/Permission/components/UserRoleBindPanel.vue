<template>
    <el-transfer
        v-model="state"
        filterable="true"
        :props="{
            key: 'id',
            label: 'name',
        }"
        :data="allRole"
        :titles="['所有角色', `${user.username}的角色`]"
        :format="{
            noChecked: '${total}',
            hasChecked: '${total}',
        }"
        :button-texts="['解绑', '绑定']"
        class="transfer"
    />
    <div class="submit">
        <el-button type="primary" :loading="btnLoading" @click="saveUserRole">提交</el-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { ElMessage } from "element-plus"
//api
import { listRole, listUserRole } from "@/api/identity/role"
import { userRoleBind } from "@/api/identity/relation"
//接口
import { Response, PageBean } from "@/interface/common/response"
import { Role } from "@/interface/identity/role"
import { UserInfo } from "@/interface/user/user"

const props = defineProps<{
    user: UserInfo
}>()
const emits = defineEmits<{
    (event: "closeDialog"): void
}>()

const btnLoading = ref(false)
const user = ref(props.user)
//角色权限ID
const state = ref<Array<number>>([])
//所有权限
const allRole = ref<Array<Role>>([])

//查询用户角色信息
function queryUserRole() {
    listUserRole(user.value.id).then((data: Response<PageBean<Array<Role>>>) => {
        if (data.status !== 200) {
            ElMessage.warning("数据拉取失败")
        }
        data.result.page.forEach((item: Permissions) => {
            state.value.unshift(item.id)
        })
    })
}
//查询所有角色
function queryListRole() {
    listRole(null, -1, []).then((data: Response<PageBean<Array<Role>>>) => {
        if (data.status !== 200) {
            ElMessage.warning("数据拉取失败")
        }
        data.result.page.forEach((item: Role) => {
            allRole.value.unshift({
                id: item.id,
                name: item.name,
            })
        })
    })
}
//保存角色权限绑定
function saveUserRole() {
    btnLoading.value = true
    userRoleBind({
        userId: user.value.id,
        roleIds: state.value,
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

queryUserRole()
queryListRole()
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

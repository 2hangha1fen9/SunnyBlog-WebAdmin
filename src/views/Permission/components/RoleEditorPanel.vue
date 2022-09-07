<template>
    <el-form :rules="rules" :model="role" ref="formRef" label-width="80px">
        <el-form-item label="角色名" prop="name" required>
            <el-input v-model="role.name"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
            <el-radio-group v-model="role.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="-1">禁用</el-radio>
            </el-radio-group>
        </el-form-item>
        <div class="submit">
            <el-button type="primary" :loading="btnLoading" @click="saveRoleInfo(formRef)">提交</el-button>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { ElMessage } from "element-plus"
import type { FormRules, FormInstance } from "element-plus"
//api
import { updateRole, addRole } from "@/api/identity/role"
//接口
import { Role } from "@/interface/identity/role"

const props = defineProps<{
    role: Role
    isAdd: boolean //true添加  false修改
}>()
const emits = defineEmits<{
    (event: "closeDialog"): void
    (event: "updateState"): void
}>()

//表单数据
const role = ref<Role>(props.role ?? {})
const isAdd = ref(props.isAdd) //当前窗口是否为添加模式
const btnLoading = ref(false)
const formRef = ref<FormInstance>()
//表单验证规则
const rules = reactive<FormRules>({
    name: [
        {
            required: true,
            trigger: "blur",
            message: "角色名不能为空",
        },
    ],
})
async function saveRoleInfo(form: FormInstance) {
    if (!form) return
    await form.validate((valid, fields) => {
        if (valid) {
            debugger
            btnLoading.value = true
            if (isAdd.value) {
                addRole(role.value).then((data) => {
                    checkResult(data)
                })
            } else {
                updateRole(role.value).then((data) => {
                    checkResult(data)
                })
            }
        }
    })
}
function checkResult(data: Response<string>) {
    if (data.status !== 200) {
        ElMessage.warning(data.message)
    } else {
        ElMessage.success("操作成功")
        setTimeout(() => {
            emits("closeDialog")
            emits("updateState")
        }, 1000)
    }
    btnLoading.value = false
}
</script>

<style scoped>
.submit {
    display: flex;
    justify-content: flex-end;
}
</style>
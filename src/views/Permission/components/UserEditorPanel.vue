<template>
    <el-form :rules="rules" ref="formRef" :model="user" label-width="80px">
        <el-form-item label="头像" prop="photo" style="height: 80px" v-if="!mode">
            <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false" :limit="1" :on-change="previewPhoto" name="data">
                <el-avatar :size="80" ref="photoRef" :src="user.photo" />
            </el-upload>
        </el-form-item>
        <el-form-item label="登录名" required prop="username">
            <el-input v-model="user.username" :disabled="!mode" />
        </el-form-item>
        <el-form-item label="密码" required prop="password" v-if="mode">
            <el-input v-model="user.password" type="password" />
        </el-form-item>
        <el-form-item label="昵称" prop="nick">
            <el-input v-model="user.nick" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
            <el-input v-model="user.phone" type="tel" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="user.email" type="email" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="user.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="-1">女</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
            <el-date-picker v-model="user.birthday" value-format="YYYY-MM-DDTHH:mm:ss" format="YYYY-MM-DDTHH:mm:ss" type="date" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
            <el-input v-model="user.remark" autosize type="textarea" />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
            <el-switch size="large" v-model="user.status" :active-value="1" :inactive-value="-1" />
        </el-form-item>
        <div class="submit">
            <el-button type="primary" :loading="loading" @click="saveUserInfo(formRef)" >提交</el-button>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { ElMessage, UploadFile } from "element-plus"
import type { FormRules, FormInstance } from "element-plus"
//api
import { updateUser, addUser } from "@/api/user/user"
import { uploadAvatar } from "@/api/user/avatar"
//接口
import { UserInfo } from "@/interface/user/user"
import { Response } from "@/interface/common/response"

const props = defineProps<{
    user: UserInfo
    isAdd: boolean
}>()
const emits = defineEmits<{
    (event: "closeDialog"): void
    (event: "updateState"): void
}>()

//表单数据
const user = ref<UserInfo>(props.user ?? {})
const mode = ref(props.isAdd) //当前窗口是否为添加模式
const photoData = ref<FormData>(new FormData()) //用户待上传的图片数据
const loading = ref(false)
const formRef = ref<FormInstance>()
//表单验证规则
const rules = reactive<FormRules>({
    username: [
        {
            required: true,
            trigger: "blur",
            message: "用户名不能为空",
        },
    ],
    password: [
        {
            required: true,
            trigger: "blur",
            message: "密码不能为空",
        },
    ],
    email: [
        {
            type: "email",
            trigger: "blur",
            message: "邮箱格式错误",
        },
    ],
    phone: [
        {
            type: "phone",
            trigger: "blur",
            message: "电话号码格式错误",
        },
    ],
})
//上传预览图片
function previewPhoto(file: UploadFile) {
    if (["image/jpeg", "image/png", "image/gif", "image/bmp", "image/ico"].indexOf(file.raw?.type) === -1) {
        ElMessage.warning("图片格式错误：只能为：png、jpeg、gif、bmp、ico")
        return false
    }
    if (file.size / 1024 / 1024 > 2) {
        ElMessage.warning("文件大小不能超过2M")
        return false
    }
    photoData.value.append("data", file.raw)
    user.value.photo = URL.createObjectURL(file.raw)
}
//提交用户信息
function saveUserInfo(form: FormInstance) {
    loading.value = true
    //如果上传了头像,先调用上传头像接口上传头像
    if (photoData.value.get("data")) {
        uploadAvatar(photoData.value, user.value.id)
            .then((data: Response<string>) => {
                if (data.status !== 200) {
                    ElMessage.warning("图片上传失败")
                    return false
                }
                user.value.photo = data.result.data
            })
            .then(() => {
                save(form)
            })
    } else {
        save(form)
    }
}
//检查结果状态
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
    loading.value = false
}
//保存用户信息
async function save(form: FormInstance) {
    if (!form) return
    await form.validate((valid, fields) => {
        if (valid) {
            if (mode.value) {
                //添加模式
                addUser(user.value).then((data: Response<string>) => {
                    checkResult(data)
                })
            } else {
                updateUser(user.value).then((data: Response<string>) => {
                    checkResult(data)
                })
            }
        } else {
            return false
        }
    })
}
</script>

<style scope>
.submit {
    display: flex;
    justify-content: flex-end;
}
</style>
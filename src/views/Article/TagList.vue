<template>
    <section class="tag-container">
        <el-card class="left-card" shadow="never">
            <template #header>
                <span>添加标签</span>
            </template>
            <el-form label-width="80px" :rules="rules" :inline="true" :model="state" ref="formRef">
                <el-form-item prop="name" required label="标签名称">
                    <el-input v-model="state.name"></el-input>
                </el-form-item>
                <el-form-item prop="color" label="标签颜色">
                    <p style="display: flex">
                        <el-input v-model="state.color" style="margin-right: 5px"></el-input>
                        <el-color-picker v-model="state.color" style="margin: -17px" />
                    </p>
                </el-form-item>
                <el-form-item prop="isPrivate" label="私有标签" v-if="state.id ? true : false">
                    <el-select v-model="state.userId" placeholder="选择用户" v-if="state.isPrivate == -1" style="margin: 5px">
                        <el-option v-for="item in users" :key="item.id" :label="item.nick || item.username" :value="item.id" />
                    </el-select>
                    <el-switch v-model="state.isPrivate" :active-value="-1" :inactive-value="1" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="clearForm">重置</el-button>
                    <el-button type="success" :loading="loading" @click="saveTag(formRef, state.id ? true : false)">{{ state.id ? "修改" : "添加" }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="right-card" shadow="never">
            <template #header>
                <span>所有标签</span>
            </template>
            <el-tooltip v-for="(tag, index) in tags" :key="tag.name" effect="dark" :content="` ${tag.articleCount} 篇文章`" placement="top-start">
                <el-tag class="tag" :color="tag.color" closable effect="dark" @click="preEditTag(tag)" @close="deleteSingleTag(tag.id, index)">
                    {{ tag.name }}
                </el-tag>
            </el-tooltip>
        </el-card>
    </section>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { ElMessage, FormRules, FormInstance } from "element-plus"
//接口
import { UserInfo } from "@/interface/user/user"
import { Response, PageBean } from "@/interface/common/response"
import { Tag } from "@/interface/article/tag"
//api
import { listUser } from "@/api/user/user"
import { listAllTag, updateTag, addTag, delTag } from "@/api/article/tag"

//表单数据
const rules = reactive<FormRules>({
    name: [
        {
            required: true,
            trigger: "blur",
            message: "名称不能为空",
        },
    ],
})
const formRef = ref<FormInstance>()
const state = reactive<Tag>({
    id: null,
    userId: null,
    name: "",
    color: "",
    isPrivate: 1,
})
const loading = ref(false)
//展示数据
const users = ref<Array<UserInfo>>([])
const tags = ref<Array<Tag>>([])

//获取所有标签
function getAllTag() {
    listAllTag().then((data: Response<Array<Tag>>) => {
        if (data.status !== 200) {
            ElMessage.warning("数据拉取失败")
        }
        tags.value = data.result
    })
}
//获取数据方法
function getAllUser() {
    listUser(1, -1, null).then((data: Response<PageBean<Array<UserInfo>>>) => {
        if (data.status !== 200) {
            ElMessage.warning("数据拉取失败")
        }
        users.value = data.result.page
    })
}
//显示编辑信息
function preEditTag(tag: Tag) {
    state.id = tag.id
    state.userId = tag.userId
    state.name = tag.name
    state.color = tag.color
    state.isPrivate = tag.isPrivate
}
function deleteSingleTag(tid: number, rowIndex: number) {
    if (tid) {
        delTag([{ id: tid }]).then((data: Response<string>) => {
            if (data.status === 200) {
                ElMessage.success("删除成功")
                tags.value.splice(rowIndex, 1)
            } else {
                ElMessage.error(data.message)
            }
        })
    }
}
//保存标签信息
async function saveTag(form: FormInstance, idEdit: boolean) {
    if (!form) return
    loading.value = true
    await form.validate((valid, fields) => {
        if (valid) {
            if (idEdit) {
                updateTag(state).then((data: Response<string>) => {
                    if (data.status === 200) {
                        ElMessage.success("修改成功")
                        //更新列表数据
                        let t = tags.value.find((item) => item.id === state.id)
                        if (t) {
                            t.id = state.id
                            t.userId = state.userId
                            t.name = state.name
                            t.color = state.color
                            t.isPrivate = state.isPrivate
                        }

                        clearForm()
                    }
                })
            } else {
                addTag(state).then((data: Response<string>) => {
                    if (data.status === 200) {
                        setTimeout(() => {
                            ElMessage.success("添加成功")
                            getAllTag()
                            clearForm()
                        }, 2000)
                    }
                })
            }
        } else {
            loading.value = false
        }
    })
}

//清空表单
function clearForm() {
    state.id = null
    state.userId = null
    state.name = ""
    state.color = ""
    state.isPrivate = 1
    loading.value = false
}

getAllTag()
getAllUser()
</script>

<style scoped>
.tag-container {
    width: 100%;
}
.left-card {
    width: 100%;
    margin: 5px;
}
.right-card {
    width: 100%;
    margin: 5px;
}
.color-pick {
    width: 100px;
}
.tag {
    cursor: pointer;
    margin: 5px;
    border: none;
    box-shadow: 3px 0px 7px rgb(0 0 0 / 12%);
}
</style>

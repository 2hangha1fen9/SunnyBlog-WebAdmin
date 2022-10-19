<template>
    <el-card class="setting-card">
        <template #header>
            <span>互动全局设置</span>
        </template>
        <el-form label-width="100px">
            <el-form-item label="文章发布策略">
                <el-radio-group v-model="globalSetting.articleStatus.value" @change="globalSetting.articleStatus.modify = true">
                    <el-radio-button :label="1">无限制</el-radio-button>
                    <el-radio-button :label="-1">需要审核</el-radio-button>
                    <el-radio-button :label="-2">禁止发布</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="评论策略">
                <el-radio-group v-model="globalSetting.commentStatus.value" @change="globalSetting.commentStatus.modify = true">
                    <el-radio-button :label="1">允许评论</el-radio-button>
                    <el-radio-button :label="2">需要审核</el-radio-button>
                    <el-radio-button :label="-1">禁止评论</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="globalSettingBtn" @click="saveGlobalSetting">设置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { ElMessage } from "element-plus"
import { Response } from "@/interface/common/response"
import { Setting } from "@/interface/article/setting"
import { Score } from "@/interface/user/score"
import { listSetting, setValue } from "@/api/article/setting"

const globalSettingBtn = ref(false)
const globalSetting = reactive({
    articleStatus: {
        value: null,
        modify: false,
    },
    commentStatus: {
        value: null,
        modify: false,
    },
})

//获取互动设置
function getGlobalSetting() {
    listSetting().then((data: Response<Array<Setting>>) => {
        data.result.forEach((item: Setting) => {
            if (item.option.includes("ArticleStatus")) {
                globalSetting.articleStatus.value = item.value
            } else if (item.option.includes("CommentStatus")) {
                globalSetting.commentStatus.value = item.value
            }
        })
    })
}
//保存互动设置
function saveGlobalSetting() {
    globalSettingBtn.value = true
    Promise.all(
        Object.keys(globalSetting).map((key) => {
            if (globalSetting[key].modify) {
                return setValue(key, globalSetting[key].value)
            }
        })
    )
        .then(() => {
            globalSettingBtn.value = false
            ElMessage.success("修改成功")
        })
        .catch(() => {
            globalSettingBtn.value = false
            ElMessage.error("修改失败")
        })
}
getGlobalSetting()
</script>

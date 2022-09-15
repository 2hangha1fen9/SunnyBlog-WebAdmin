<template>
    <section>
        <el-card class="setting-card">
            <template #header>
                <span>互动全局设置</span>
            </template>
            <el-form label-width="100px">
                <el-form-item label="文章发布策略">
                    <el-radio-group v-model="globalSetting.articleStatus.value" @change="globalSetting.articleStatus.modify = true">
                        <el-radio-button :label="-1">需要审核</el-radio-button>
                        <el-radio-button :label="-2">禁止发布</el-radio-button>
                        <el-radio-button :label="1">无限制</el-radio-button>
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
        <el-card>
            <template #header>
                <span>积分设置</span>
            </template>
            <el-form label-width="80px">
                <el-form-item label="签到">
                    <el-input type="number" @change="scoreUnit.checkIn.modify = true" v-model.number="scoreUnit.checkIn.value"></el-input>
                </el-form-item>
                <el-form-item label="评论">
                    <el-input type="number" @change="scoreUnit.comment.modify = true" v-model.number="scoreUnit.comment.value"></el-input>
                </el-form-item>
                <el-form-item label="点赞">
                    <el-input type="number" @change="scoreUnit.like.modify = true" v-model.number="scoreUnit.like.value"></el-input>
                </el-form-item>
                <el-form-item label="收藏">
                    <el-input type="number" @change="scoreUnit.favourite.modify = true" v-model.number="scoreUnit.favourite.value"></el-input>
                </el-form-item>
                <el-form-item label="被点赞">
                    <el-input type="number" @change="scoreUnit.beLike.modify = true" v-model.number="scoreUnit.beLike.value"></el-input>
                </el-form-item>
                <el-form-item label="被收藏">
                    <el-input type="number" @change="scoreUnit.beFavourite.modify = true" v-model.number="scoreUnit.beFavourite.value"></el-input>
                </el-form-item>
                <el-form-item label="发表文章">
                    <el-input type="number" @change="scoreUnit.publish.modify = true" v-model.number="scoreUnit.publish.value"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="setScore" :loading="scoreUnitBtn">设置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </section>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { ElMessage } from "element-plus"
import { Response } from "@/interface/common/response"
import { Setting } from "@/interface/article/setting"
import { Score } from "@/interface/user/score"
import { listSetting, setValue } from "@/api/article/setting"
import { listScoreUnit, setScoreUnit } from "@/api/user/score"

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

const scoreUnitBtn = ref(false)
const scoreUnit = reactive({
    checkIn: {
        name: "签到",
        value: null,
        modify: false,
    },
    comment: {
        name: "评论",
        value: null,
        modify: false,
    },
    like: {
        name: "点赞",
        value: null,
        modify: false,
    },
    favourite: {
        name: "收藏",
        value: null,
        modify: false,
    },
    beLike: {
        name: "被点赞",
        value: null,
        modify: false,
    },
    beFavourite: {
        name: "被收藏",
        value: null,
        modify: false,
    },
    publish: {
        name: "发表文章",
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

//获取积分设置列表
function getScoreUnit() {
    listScoreUnit().then((data: Response<Array<Score>>) => {
        data.result.forEach((item: Score) => {
            if (item.name == "签到") {
                scoreUnit.checkIn.value = item.value
            } else if (item.name == "评论") {
                scoreUnit.comment.value = item.value
            } else if (item.name == "点赞") {
                scoreUnit.like.value = item.value
            } else if (item.name == "收藏") {
                scoreUnit.favourite.value = item.value
            } else if (item.name == "被点赞") {
                scoreUnit.beLike.value = item.value
            } else if (item.name == "被收藏") {
                scoreUnit.beFavourite.value = item.value
            } else if (item.name == "发表文章") {
                scoreUnit.publish.value = item.value
            }
        })
    })
}
function setScore() {
    scoreUnitBtn.value = true
    Promise.all(
        Object.keys(scoreUnit).map((key) => {
            if (scoreUnit[key].modify) {
                return setScoreUnit(scoreUnit[key].name, scoreUnit[key].value)
            }
        })
    )
        .then(() => {
            scoreUnitBtn.value = false
            ElMessage.success("修改成功")
        })
        .catch(() => {
            scoreUnitBtn.value = false
            ElMessage.error("修改失败")
        })
}

getScoreUnit()
getGlobalSetting()
</script>

<style scoped>
.setting-card {
    margin-bottom: 20px;
}
</style>

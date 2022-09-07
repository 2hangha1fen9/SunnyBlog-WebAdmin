<template>
    <section class="markdown-container">
        <header class="title">
            <el-input v-model="article.title" placeholder="文章标题"></el-input>
            <el-button type="success" class="title-submit" :loading="btnLoading" @click="saveArticle">保存</el-button>
        </header>
        <div id="vditor"></div>
        <el-dialog @close="btnLoading = false" v-model="dialogVisible" v-if="dialogVisible" title="发布文章">
            <ArticleSettingPanel :article="article" :isEdit="false" @closeDialog="dialogVisible = false"></ArticleSettingPanel>
        </el-dialog>
    </section>
</template>

<script setup lang="ts">
import Vditor from "vditor"
import "vditor/dist/index.css"
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import ArticleSettingPanel from "./components/ArticleSettingPanel.vue"
//接口
import { Article } from "@/interface/article/article"
import { Response } from "@/interface/common/response"
// api
import { uploadPicture } from "@/api/article/drawing-bed"
import { updateArticle, getArticle } from "@/api/article/article"


const router = useRouter()
const route = useRoute()

//从路由中获取文章id
const articleId: number = parseInt(route.query["articleId"])
const isEdit = Boolean(route.query["isEdit"])
const btnLoading = ref(false)
const dialogVisible = ref(false) //对话框显示状态
const article = ref<Article>({})

//初始化文章数据
function initArticle() {
    getArticle(articleId).then((data: Response<Article>) => {
        article.value = data.result
        vditor.value?.setValue(data.result.content)
        //将分类数据,标签数据转换为ID数组
        let tagIds = []
        article.value.tags.forEach((item) => {
            tagIds.unshift(item.id)
        })
        article.value.tags = tagIds
        let categoryIds = []
        article.value.categorys.forEach((item) => {
            tagIds.unshift(item.id)
        })
        article.value.categorys = categoryIds
    })
}

function saveArticle() {
    btnLoading.value = true
    article.value.content = vditor.value?.getValue()
    if (isEdit) {
        //编辑模式
        updateArticle(article.value).then((data: Response<string>) => {
            if (data.status === 200) {
                ElMessage.success("保存成功")
                router.back()
            } else {
                ElMessage.error(data.message)
            }
            btnLoading.value = false
        })
    } else {
        dialogVisible.value = true
    }
}

function demo() {
    console.log(vditor.value?.getValue())
}

//markdown编辑器
const vditor = ref<Vditor | null>(null)
onMounted(() => {
    if (isEdit) {
        initArticle()
    }
    //markdown编辑器配置
    vditor.value = new Vditor("vditor", {
        height: "81vh",
        typewriterMode: true, //打字机模式
        cache: {
            enable: false, //关闭localStorage缓存
        },
        fullscreen: {
            index: 9999, //全屏层级
        },
        preview: {
            markdown: {
                toc: true,
            },
        },
        toolbar: ["outline", "|", "emoji", "headings", "bold", "italic", "strike", "line", "|", "outdent", "indent", "|", "quote", "list", "ordered-list", "check", "table", "|", "code", "inline-code", "|", "insert-after", "insert-before", "|", "undo", "redo", "|", "upload", "link", "|", "code-theme", "content-theme", "export", "|", "edit-mode", "preview", "fullscreen"],
        upload: {
            //自定义上传逻辑
            accept: "image/*",
            handler(files) {
                let formData = new FormData()
                formData.append("data", files[0])
                uploadPicture(formData).then((data: Response<string>) => {
                    if (data.status === 200) {
                        debugger
                        let imgUrl = `${process.env.VUE_APP_BASE_API}/article-service${data.result.path}`
                        let linkUrl = `![${"img"}](${imgUrl})`
                        vditor.value?.insertValue(linkUrl)
                    } else {
                        ElMessage.warning("图片上传失败")
                    }
                })
            },
        },
    })
})
</script>

<style scoped>
.markdown-container {
    height: 100%;
}

.title {
    display: flex;
    margin: 5px 0px 5px 0px;
}
.title-submit {
    margin: 0px 5px 0px 5px;
}
</style>
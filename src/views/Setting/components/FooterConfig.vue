<template>
    <el-card class="setting-card">
        <template #header>
            <div class="config-submit">
                <span>网站说明</span>
                <el-button :loading="loading" @click="setFooter">保存</el-button>
            </div>
        </template>
        <div id="vditor-footer"></div>
    </el-card>
</template>

<script setup lang="ts">
import Vditor from "vditor"
import "vditor/dist/index.css"
import { ElMessage } from "element-plus"
import { ref, onMounted, nextTick } from "vue"
import { Response } from "@/interface/common/response"
import { getConfig, setConfig } from "@/api/article/siteconfig"
import { uploadPicture } from "@/api/article/drawing-bed"
import { getImgUrl } from "@/utils/converter"

const footer = ref("")
const loading = ref(false)
///markdown编辑器
const vditor = ref<Vditor | null>(null)
onMounted(() => {
    //markdown编辑器配置
    vditor.value = new Vditor("vditor-footer", {
        preview: {
            markdown: {
                mark: true,
            },
        },
        cache: {
            enable: false,
        },
        toolbar: ["emoji", "undo", "redo", "upload"],
        upload: {
            //自定义上传逻辑
            accept: "image/*",
            handler(files) {
                let formData = new FormData()
                formData.append("data", files[0])
                uploadPicture(formData).then((data: Response<string>) => {
                    if (data.status === 200) {
                        debugger
                        let imgUrl = getImgUrl("article-service", data.result.path, false)
                        let linkUrl = `![${"img"}](${imgUrl})`
                        vditor.value?.insertValue(linkUrl)
                    } else {
                        ElMessage.warning("图片上传失败")
                    }
                })
            },
        },
        after() {
            getFooter()
        },
    })
})

function getFooter() {
    getConfig("footer").then((data: Response<string>) => {
        if (data.status === 200) {
            footer.value = data.result
            nextTick(() => {
                vditor.value?.setValue(data.result || "")
            })
        } else {
            ElMessage.warning(data.message)
        }
    })
}
function setFooter() {
    loading.value = true
    footer.value = vditor.value?.getValue()
    setConfig("footer", footer.value)
        .then((data: Response<string>) => {
            if (data.status === 200) {
                ElMessage.success(data.result)
            } else {
                ElMessage.warning(data.message)
            }
        })
        .finally(() => {
            loading.value = false
        })
}
</script>

<template>
    <el-form :model="region" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="名称" required prop="name">
            <el-input v-model="region.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="summary">
            <el-input v-model="region.description" type="textarea" />
        </el-form-item>
        <el-form-item label="上级分区" prop="parentId">
            <el-tree-select
                v-model="region.parentId"
                :data="regions"
                node-key="id"
                :props="{
                    label: 'name',
                    children: 'inverseParent',
                }"
                clearable
                check-strictly
                :render-after-expand="false"
            />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
            <el-switch size="large" v-model="region.status" :active-value="1" :inactive-value="-1" />
        </el-form-item>
        <div class="submit">
            <el-button type="primary" :loading="loading" @click="saveRegion(formRef)" >提交</el-button>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { ElMessage, FormRules, FormInstance } from "element-plus"
import { Response } from "@/interface/common/response"
import { Region } from "@/interface/article/region"
import { listRegion, updateRegion, addRegion } from "@/api/article/region"

const props = defineProps<{
    region: Region
    isEdit: boolean
}>()
const emits = defineEmits<{
    (event: "closeDialog"): void
    (event: "updateState"): void
}>()

const region = ref<Region>(props.region ?? {})
const regions = ref<Array<Region>>([])
const loading = ref(false)
const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
    name: [
        {
            required: true,
            trigger: "blur",
            message: "分区名称不能为空",
        },
    ],
})
//保存信息
async function saveRegion(form: FormInstance) {
    await form.validate((valid, fields) => {
        if (valid) {
            loading.value = true
            if (props.isEdit) {
                updateRegion(region.value).then((data: Response<string>) => {
                    if (data.status === 200) {
                        ElMessage.success("操作成功")
                        setTimeout(() => {
                            emits("closeDialog")
                            emits("updateState")
                            loading.value = false
                        }, 2000)
                    } else {
                        ElMessage.warning(data.message)
                    }
                })
            } else {
                addRegion(region.value).then((data: Response<string>) => {
                    if (data.status === 200) {
                        setTimeout(() => {
                            emits("closeDialog")
                            emits("updateState")
                            loading.value = false
                        }, 2000)
                    } else {
                        ElMessage.warning(data.message)
                    }
                })
            }
        }
    })
}

//获取所有分区
function getRegions() {
    listRegion().then((data: Response<Array<Region>>) => {
        if (data.status === 200) {
            if (props.isEdit) {
                regions.value = hideChlid(data.result, region.value.id) //编辑模式隐藏自身和子元素
            } else {
                regions.value = data.result
            }
        } else {
            ElMessage.warning("信息获取失败")
        }
    })
}
//隐藏自身
function hideChlid(regions: Array<Region>, rid: number) {
    let newRegions = regions.filter((item: Region) => item.id !== rid)
    newRegions.forEach((item) => item.inverseParent && (item.inverseParent = hideChlid(item.inverseParent, rid)))
    return newRegions
}

getRegions()
</script>

<style scoped>
.submit {
    display: flex;
    justify-content: flex-end;
}
</style>

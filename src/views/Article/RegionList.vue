<template>
    <section>
        <header class="header">
            <el-button size="small" type="success" @click="handleDialogVisible({}, false)">添加分区</el-button>
        </header>
        <el-table
            :data="state"
            :tree-props="{
                children: 'inverseParent',
                hasChildren: 'inverseParent.length',
            }"
            ref="tableRef"
            :indent="30"
            row-key="id"
            current-row-key="id"
            v-loading="tableLoading"
        >
            <el-table-column prop="name" fixed="left" label="名称"></el-table-column>
            <el-table-column prop="id" width="80" label="编号" />
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column prop="status" fixed="right" width="80" label="状态">
                <template #default="scope">
                    <el-switch @change="handleStatusChange($event, scope.row.id)" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" size="large" v-model="scope.row.status" inline-prompt :active-value="1" active-text="启用" :inactive-value="-1" inactive-text="禁用" />
                </template>
            </el-table-column>
            <el-table-column fixed="right" width="120" label="操作">
                <template #default="scope">
                    <el-button-group>
                        <el-popover :show-after="200" ref="popover">
                            <template #reference>
                                <el-button type="primary" size="small" @click="handleDialogVisible(scope.row, true)">编辑</el-button>
                            </template>
                            <el-input placeholder="添加子级" size="small" v-model="quickAddRegionName" @focus="popover.popover = true" @keydown.enter="quickAddRegion(scope.row)"></el-input>
                        </el-popover>
                        <el-popconfirm title="您确定要删除这条记录吗" v-if="!scope.row.inverseParent.length" @confirm="handleSingleDelete(scope.row)">
                            <template #reference>
                                <el-button type="danger" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </el-button-group>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="什么也没有" />
            </template>
        </el-table>
        <el-dialog v-model="dialogVisible" v-if="dialogVisible" :title="isEdit ? '编辑分区' : '添加分区'">
            <RegionEditorPanel :region="rowRef" :isEdit="isEdit" @closeDialog="dialogVisible = false" @updateState="listRegion"></RegionEditorPanel>
        </el-dialog>
    </section>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { ElMessage, ElTable, ElPopover } from "element-plus"
import { debounce, throttle } from "lodash" //引入防抖节流
import RegionEditorPanel from "./components/RegionEditorPanel.vue"
// api
import { listAllRegion, updateRegion, delRegion, addRegion } from "@/api/article/region"
//接口
import { Response } from "@/interface/common/response"
import { Region } from "@/interface/article/region"

const state = ref<Array<Region>>([])
const tableLoading = ref(false) //表格加载动画
const dialogVisible = ref(false)
const isEdit = ref(true) //对话框模式
const rowRef = ref<Region>({}) //当前行的引用
const quickAddRegionName = ref<string>() //快速添加子级输入框引用
const popover = ref<ElPopover>() //是气泡框输入时显示控制

const listRegion = throttle(function () {
    tableLoading.value = true
    listAllRegion().then((data: Response<Array<Region>>) => {
        state.value = data.result
        tableLoading.value = false
    })
}, 200)

//改变分区状态
const handleStatusChange = debounce(function (newVal, id) {
    updateRegion({
        id: id,
        status: newVal,
    }).then((data: Response<string>) => {
        if (data.status === 200) {
            ElMessage.success(data.message)
        } else {
            ElMessage.error(data.message)
        }
    })
}, 20)
//编辑分区
function handleDialogVisible(region: Region, mode: boolean) {
    isEdit.value = mode
    if (mode) {
        rowRef.value.id = region.id
        rowRef.value.name = region.name
        rowRef.value.description = region.description
        rowRef.value.status = region.status
        rowRef.value.parentId = region.parentId
    } else {
        rowRef.value.id = null
        rowRef.value.name = ""
        rowRef.value.description = ""
        rowRef.value.parentId = ""
        rowRef.value.status = 1
    }
    dialogVisible.value = true
}
//删除分区
function handleSingleDelete(region: Region) {
    if (region.inverseParent.length) {
        ElMessage.warning("该分区下还有子节点")
        return
    }
    delRegion([{ id: region.id }]).then((data: Response<string>) => {
        if (data.status === 200) {
            ElMessage.success(data.message)
            state.value = deleteRow(state.value, region.id)
        } else {
            ElMessage.error(data.message)
        }
    })
}
//递归删除行
function deleteRow(state: Array<Region>, deleteId: number) {
    let newState = state.filter((s) => s.id !== deleteId) //尝试过滤待删除的键
    newState.forEach((s) => s.inverseParent && (s.inverseParent = deleteRow(s.inverseParent, deleteId))) //过滤子元素
    return newState
}
//快速添加分区
function quickAddRegion(parent: Region) {
    if (quickAddRegionName.value) {
        addRegion({
            name: quickAddRegionName.value,
            status: 1,
            parentId: parent.id,
        }).then((data: Response<string>) => {
            if (data.status === 200) {
                ElMessage.success("添加成功")
                setTimeout(() => {
                    listRegion()
                }, 2000)
            } else {
                ElMessage.warning("添加失败")
            }
            quickAddRegionName.value = ""
        })
    }
}

listRegion()
</script>

<style>
.header {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
}
</style>

<template>
    <section>
        <el-card class="search" shadow="never">
            <template #header>
                <span>条件搜索: </span>
                <el-select v-model="selectCondidtion" multiple class="select">
                    <el-option v-for="con in condidtion" :key="con.key" :value="con.key" :label="con.label" />
                </el-select>
                <el-button-group class="btn-group">
                    <el-button type="primary" @click="getRoleList">搜索</el-button>
                    <el-button type="primary" @click="selectCondidtion = []">重置</el-button>
                </el-button-group>
            </template>
            <div class="values">
                <p v-for="con in searchCondidtion" :key="con.key" class="values-item">
                    <el-radio-group v-if="con.isState && con.key === 'status'" v-model="con.value">
                        <el-radio-button :label="1">启用</el-radio-button>
                        <el-radio-button :label="-1">禁用</el-radio-button>
                    </el-radio-group>
                    <el-radio-group v-else-if="con.isState && con.key === 'isDefault'" v-model="con.value">
                        <el-radio-button :label="1">默认</el-radio-button>
                        <el-radio-button :label="-1">非默认</el-radio-button>
                    </el-radio-group>
                    <el-input v-else v-model="con.value" @keyup.enter="getRoleList">
                        <template #prepend>
                            <span>{{ con.label }}</span>
                        </template>
                    </el-input>
                </p>
            </div>
        </el-card>
        <el-table :data="state.page" border ref="tableRef" current-row-key="id" v-loading="tableLoading">
            <el-table-column prop="id" label="编号" width="100">
                <template #header>
                    <el-button type="success" size="small" @click="handleDialogVisible({}, true)">添加角色</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="角色名"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" :formatter="updateTimeFormatter"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="createTimeFormatter"></el-table-column>
            <el-table-column prop="status" fixed="right" width="80" label="状态">
                <template #default="scope">
                    <el-switch style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" size="large" @change="handleStatusChange($event, scope.row.id)" v-model="scope.row.status" inline-prompt :active-value="1" active-text="启用" :inactive-value="-1" inactive-text="禁用" />
                </template>
            </el-table-column>
            <el-table-column prop="isDefault" fixed="right" width="100" label="是否默认">
                <template #default="scope">
                    <el-switch size="large" @change="handleIsDefaultChange($event, scope.row.id)" v-model="scope.row.isDefault" inline-prompt :active-value="1" active-text="默认" :inactive-value="-1" inactive-text="非默认" />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template #default="scope">
                    <el-button-group>
                        <el-popconfirm title="您确定要删除这条记录吗" @confirm="handleSingleDelete(scope.row.id, scope.$index)">
                            <template #reference>
                                <el-button type="danger" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                        <el-button type="primary" size="small" @click="handleDialogVisible(scope.row, false)">编辑</el-button>
                        <el-button type="success" size="small" @click="handleBindDialogVisible(scope.row)">分配权限</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="什么也没有" />
            </template>
        </el-table>
        <footer class="footer">
            <el-pagination class="pageination" background layout="jumper, prev, pager, next , total ,sizes" :total="state.totalCount" v-model:currentPage="state.pageIndex" v-model:page-size="state.pageSize" />
        </footer>
        <el-dialog v-if="dialogVisible" v-model="dialogVisible" :title="isAdd ? '添加角色' : '更新角色'">
            <RoleEditorPanel @updateState="getRoleList" @closeDialog="dialogVisible = false" :role="rowRef" :isAdd="isAdd"></RoleEditorPanel>
        </el-dialog>
        <el-dialog v-if="bindDialogVisible" width="80%" v-model="bindDialogVisible" title="分配权限">
            <RolePermissionBindPanel :role="rowRef" @closeDialog="bindDialogVisible = false" />
        </el-dialog>
    </section>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue"
import { ElMessage, ElTable } from "element-plus"
import { Role } from "@/interface/identity"
import { SearchCondidtion } from "@/interface/search-condition"
import { PageBean, Response } from "@/interface/response"
import { listRole, updateRole, delRole } from "@/api/identity"
import { debounce, throttle } from "lodash" //引入防抖节流
import { dateTimeFormatter } from "@/utils/converter"
import RoleEditorPanel from "./components/RoleEditorPanel.vue"
import RolePermissionBindPanel from "./components/RolePermissionBindPanel.vue"

const tableLoading = ref(false) //表格加载动画
const dialogVisible = ref(false) //对话框显示状态
const bindDialogVisible = ref(false) //角色绑定对话框显示状态
const state = reactive<PageBean<Array<Role>>>({}) //表格数据
const tableRef = ref<InstanceType<typeof ElTable>>() //表格引用
const rowRef = reactive<Role>({}) //当前行引用
const isAdd = ref(false) //true添加 false修改

//所有条件
const condidtion = [
    {
        key: "name",
        value: "",
        label: "角色名",
    },
    {
        key: "status",
        value: "1",
        label: "状态",
        isState: true,
    },
    {
        key: "isDefault",
        value: "1",
        label: "是否为默认",
        isState: true,
    },
]
//已选条件
const selectCondidtion = ref([])
//动态计算已选中的模型
const searchCondidtion = computed(() =>
    reactive<Array<SearchCondidtion>>(
        condidtion.filter((item) => {
            return selectCondidtion.value.indexOf(item.key) != -1
        })
    )
)
//获取数据方法
const getRoleList = throttle(function () {
    tableLoading.value = true
    listRole(state.pageIndex, state.pageSize, searchCondidtion.value).then((data: Response<PageBean<Array<Role>>>) => {
        if (data.status !== 200) {
            ElMessage.warning("数据拉取失败")
        }
        //将结果保存
        state.page = data.result.page
        state.pageSize = data.result.pageSize
        state.totalPages = data.result.totalPages
        state.totalCount = data.result.totalCount
        tableLoading.value = false
    })
}, 200)
//改变权限状态
const handleStatusChange = debounce(function (newVal, id) {
    updateRole({
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
//改变权限默认状态
const handleIsDefaultChange = debounce(function (newVal, id) {
    updateRole({
        id: id,
        isDefault: newVal,
    }).then((data: Response<string>) => {
        if (data.status === 200) {
            ElMessage.success(data.message)
        } else {
            ElMessage.error(data.message)
        }
    })
}, 20)
//删除角色
function handleSingleDelete(id: number, rowIndex: number) {
    delRole([{ id: id }]).then((data: Response<string>) => {
        if (data.status === 200) {
            ElMessage.success(data.message)
            state.page.splice(rowIndex, 1)
        } else {
            ElMessage.error(data.message)
        }
    })
}
//弹出修改对话框
//mode true 添加 false修改
function handleDialogVisible(role: Role, mode: boolean) {
    if (!mode) {
        rowRef.id = role.id
        rowRef.name = role.name
        rowRef.isDefault = role.isDefault
        rowRef.status = role.status
    } else {
        rowRef.id = null
        rowRef.name = null
        rowRef.isDefault = -1
        rowRef.status = 1
    }
    isAdd.value = mode
    dialogVisible.value = true
}
//角色权限对话框显示
function handleBindDialogVisible(role: Role) {
    rowRef.id = role.id
    rowRef.name = role.name
    rowRef.status = role.status
    rowRef.isDefault = role.isDefault
    bindDialogVisible.value = true
}
//日期格式化
function updateTimeFormatter(row: Role) {
    return dateTimeFormatter(row.updateTime)
}
function createTimeFormatter(row: Role) {
    return dateTimeFormatter(row.createTime)
}

//监听页码页面尺寸
watch([() => state.pageIndex, () => state.pageSize], () => {
    getRoleList()
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" }) //滚动到页面顶部
})

getRoleList()
</script>

<style scoped>
.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
}
.search {
    margin-bottom: 10px;
}
.select {
    min-width: 40%;
}

.btn-group {
    margin: 5px;
}

.values {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
.values-item {
    display: inline-block;
    max-width: 500px;
    margin: 5px;
}
</style>

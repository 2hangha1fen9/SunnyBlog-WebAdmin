<template>
    <section>
        <el-card class="search" shadow="never">
            <template #header>
                <span>条件搜索: </span>
                <el-select v-model="selectCondidtion" multiple class="select">
                    <el-option v-for="con in condidtion" :key="con.key" :value="con.key" :label="con.label" />
                </el-select>
                <el-button-group class="btn-group">
                    <el-button type="primary" @click="getPermissionList">搜索</el-button>
                    <el-button type="primary" @click="selectCondidtion = []">重置</el-button>
                </el-button-group>
            </template>
            <div class="values">
                <p v-for="con in searchCondidtion" :key="con.key" class="values-item">
                    <el-radio-group v-if="con.isState && con.key === 'status'" v-model="con.value">
                        <el-radio-button :label="1">启用</el-radio-button>
                        <el-radio-button :label="-1">禁用</el-radio-button>
                    </el-radio-group>
                    <el-radio-group v-else-if="con.isState && con.key === 'isPublic'" v-model="con.value">
                        <el-radio-button :label="1">开启</el-radio-button>
                        <el-radio-button :label="-1">关闭</el-radio-button>
                    </el-radio-group>
                    <el-input v-else v-model="con.value" @keyup.enter="getPermissionList">
                        <template #prepend>
                            <span>{{ con.label }}</span>
                        </template>
                    </el-input>
                </p>
            </div>
        </el-card>
        <el-table :data="state.page" border ref="tableRef" current-row-key="id" v-loading="tableLoading">
            <el-table-column prop="id" label="编号" width="70"></el-table-column>
            <el-table-column prop="service" label="服务" width="150"></el-table-column>
            <el-table-column prop="controller" label="资源" width="100"></el-table-column>
            <el-table-column prop="action" label="操作" width="180"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="180" :formatter="updateTimeFormatter"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" :formatter="createTimeFormatter"></el-table-column>
            <el-table-column prop="description" fixed="right" label="描述" width="300"></el-table-column>
            <el-table-column prop="status" fixed="right" width="80" label="状态">
                <template #default="scope">
                    <el-switch style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" size="large" @change="handleStatusChange($event, scope.row.id)" v-model="scope.row.status" inline-prompt :active-value="1" active-text="启用" :inactive-value="-1" inactive-text="禁用" />
                </template>
            </el-table-column>
            <el-table-column prop="isPublic" fixed="right" width="100" label="匿名访问">
                <template #default="scope">
                    <el-switch size="large" @change="handleIsPublicChange($event, scope.row.id)" v-model="scope.row.isPublic" inline-prompt :active-value="1" active-text="开启" :inactive-value="-1" inactive-text="关闭" />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="handleDialogVisible(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="什么也没有" />
            </template>
        </el-table>
        <footer class="footer">
            <el-pagination class="pageination" background layout="jumper, prev, pager, next , total ,sizes" :total="state.totalCount" v-model:currentPage="state.pageIndex" v-model:page-size="state.pageSize" />
        </footer>
        <el-dialog v-model="dialogVisible" title="修改权限信息">
            <el-form :model="rowRef" label-width="80px">
                <el-form-item label="服务" prop="service">
                    <el-input v-model="rowRef.service" disabled></el-input>
                </el-form-item>
                <el-form-item label="资源" prop="controller">
                    <el-input v-model="rowRef.controller" disabled></el-input>
                </el-form-item>
                <el-form-item label="操作" prop="action">
                    <el-input v-model="rowRef.action" disabled></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="rowRef.description" autosize type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-radio-group v-model="rowRef.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="-1">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否公开" prop="isPublic">
                    <el-radio-group v-model="rowRef.isPublic">
                        <el-radio :label="1">开启</el-radio>
                        <el-radio :label="-1">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="submit">
                    <el-button type="primary" :loading="btnLoading" @click="savePermissionInfo">提交</el-button>
                </div>
            </el-form>
        </el-dialog>
    </section>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue"
import { ElMessage, ElTable } from "element-plus"
import { Permission } from "@/interface/identity"
import { SearchCondidtion } from "@/interface/search-condition"
import { PageBean, Response } from "@/interface/response"
import { listPermission, updatePermission } from "@/api/identity"
import { debounce, throttle } from "lodash" //引入防抖节流
import { dateTimeFormatter } from "@/utils/converter"

const btnLoading = ref(false)
const tableLoading = ref(false) //表格加载动画
const dialogVisible = ref(false) //对话框显示状态
const state = reactive<PageBean<Array<Permission>>>({}) //表格数据
const tableRef = ref<InstanceType<typeof ElTable>>() //表格引用
const rowRef = reactive<Permission>({}) //当前行引用

//所有条件
const condidtion = [
    {
        key: "service",
        value: "",
        label: "服务",
    },
    {
        key: "controller",
        value: "",
        label: "资源",
    },
    {
        key: "action",
        value: "",
        label: "操作",
    },
    {
        key: "description",
        value: "",
        label: "描述",
    },
    {
        key: "status",
        value: "1",
        label: "状态",
        isState: true,
    },
    {
        key: "isPublic",
        label: "匿名访问",
        value: "1",
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
const getPermissionList = throttle(function () {
    tableLoading.value = true
    listPermission(state.pageIndex, state.pageSize, searchCondidtion.value).then((data: Response<PageBean<Array<Permission>>>) => {
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
    updatePermission({
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
const handleIsPublicChange = debounce(function (newVal, id) {
    updatePermission({
        id: id,
        isPublic: newVal,
    }).then((data: Response<string>) => {
        if (data.status === 200) {
            ElMessage.success(data.message)
        } else {
            ElMessage.error(data.message)
        }
    })
}, 20)
function savePermissionInfo() {
    btnLoading.value = true
    updatePermission(rowRef).then((data) => {
        if (data.status !== 200) {
            ElMessage.warning(data.message)
        } else {
            ElMessage.success("操作成功")
            setTimeout(() => {
                dialogVisible.value = false
                getPermissionList()
            }, 1000)
        }
        btnLoading.value = false
    })
}
//弹出修改对话框
function handleDialogVisible(permission: Permission) {
    rowRef.id = permission.id
    rowRef.service = permission.service
    rowRef.controller = permission.controller
    rowRef.action = permission.action
    rowRef.description = permission.description
    rowRef.status = permission.status
    rowRef.isPublic = permission.isPublic
    dialogVisible.value = true
}
//日期格式化
function updateTimeFormatter(row: Permission) {
    return dateTimeFormatter(row.updateTime)
}
function createTimeFormatter(row: Permission) {
    return dateTimeFormatter(row.createTime)
}

//监听页码页面尺寸
watch([() => state.pageIndex, () => state.pageSize], () => {
    getPermissionList()
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" }) //滚动到页面顶部
})

getPermissionList()
</script>

<style scoped>
.submit {
    display: flex;
    justify-content: flex-end;
}
.footer {
    display: flex;
    justify-content: flex-end;
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

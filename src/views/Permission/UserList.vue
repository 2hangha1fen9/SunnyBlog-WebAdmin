<template>
    <section>
        <el-card class="search" shadow="never">
            <template #header>
                <span>条件搜索: </span>
                <el-select v-model="selectCondidtion" multiple class="select">
                    <el-option v-for="con in condidtion" :key="con.key" :value="con.key" :label="con.label" />
                </el-select>
                <el-button-group class="btn-group">
                    <el-button type="primary" @click="getUserList">搜索</el-button>
                    <el-button type="primary" @click="resetCondidtion">重置</el-button>
                </el-button-group>
            </template>
            <div class="values">
                <p v-for="con in searchCondidtion" :key="con.key" class="values-item">
                    <el-tooltip v-if="con.isState && con.key === 'sex'" :content="con.label" placement="bottom">
                        <el-radio-group v-model="con.value">
                            <el-radio-button :label="1">男</el-radio-button>
                            <el-radio-button :label="-1">女</el-radio-button>
                            <el-radio-button :label="0">未知</el-radio-button>
                        </el-radio-group>
                    </el-tooltip>
                    <el-tooltip v-else-if="con.isState && con.key === 'status'" :content="con.label" placement="bottom">
                        <el-radio-group v-model="con.value">
                            <el-radio-button :label="1">启用</el-radio-button>
                            <el-radio-button :label="-1">禁用</el-radio-button>
                        </el-radio-group>
                    </el-tooltip>
                    <el-tooltip v-else-if="con.isState && con.key === 'registerTime'" :content="con.label" placement="bottom">
                        <el-radio-group v-model="con.sort">
                            <el-radio-button :label="1">{{ con.label }} 升序</el-radio-button>
                            <el-radio-button :label="-1">{{ con.label }} 降序</el-radio-button>
                        </el-radio-group>
                    </el-tooltip>
                    <el-input v-else v-model="con.value" @keyup.enter="getUserList">
                        <template #prepend>
                            <span>{{ con.label }}</span>
                        </template>
                    </el-input>
                </p>
            </div>
        </el-card>
        <el-table :data="state.page" border ref="tableRef" v-loading="tableLoading">
            <el-table-column type="selection" fixed width="55" />
            <el-table-column prop="id" fixed label="编号" width="100">
                <template #header>
                    <el-button size="small" @click="handleDialogVisible({}, true)">添加用户</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="username" fixed label="登录名" width="150"></el-table-column>
            <el-table-column prop="nick" label="昵称" width="100"></el-table-column>
            <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="220"></el-table-column>
            <el-table-column prop="sex" label="性别" :formatter="sexFormatter" width="60"></el-table-column>
            <el-table-column prop="birthday" label="生日" :formatter="userDateFormatter" width="120"></el-table-column>
            <el-table-column prop="registerTime" label="注册时间" :formatter="registerTimeFormatter" width="200"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="score" label="积分" width="60"></el-table-column>
            <el-table-column prop="status" fixed="right" width="80" label="状态">
                <template #default="scope">
                    <el-switch style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" size="large" @change="handleStatusChange($event, scope.row.id)" v-model="scope.row.status" inline-prompt :active-value="1" active-text="启用" :inactive-value="-1" inactive-text="禁用" />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template #default="scope">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="handleDialogVisible(scope.row, false)">编辑</el-button>
                        <el-popconfirm title="您确定要删除这条记录吗" @confirm="handleSingleDelete(scope.row.id, scope.$index)">
                            <template #reference>
                                <el-button type="danger" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                        <el-button size="small" type="success" @click="handleBindDialogVisible(scope.row)">分配角色</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="什么也没有" />
            </template>
        </el-table>
        <footer class="footer">
            <div>
                <el-popconfirm title="您确定要删除选中的记录吗" @confirm="handleManyDelete">
                    <template #reference>
                        <el-button type="danger" size="small">批量删除</el-button>
                    </template>
                </el-popconfirm>
            </div>
            <el-pagination class="pageination" background layout="jumper, prev, pager, next , total ,sizes" :total="state.totalCount" v-model:currentPage="state.pageIndex" v-model:page-size="state.pageSize" />
        </footer>
        <el-dialog v-model="dialogVisible" v-if="dialogVisible" :title="isAdd ? '添加用户' : '修改用户信息'">
            <EditorPanel :user="rowRef" :isAdd="isAdd" @closeDialog="dialogVisible = false" @updateState="getUserList"></EditorPanel>
        </el-dialog>
        <el-dialog v-if="bindDialogVisible" width="80%" v-model="bindDialogVisible" title="分配角色">
            <UserRoleBind :user="rowRef" @closeDialog="bindDialogVisible = false" />
        </el-dialog>
    </section>
</template>

<script setup lang="ts">
import { reactive, watch, ref, computed } from "vue"
import { ElMessage, ElTable } from "element-plus"
import { debounce, throttle } from "lodash" //引入防抖节流
import EditorPanel from "./components/UserEditorPanel.vue"
import UserRoleBind from "./components/UserRoleBindPanel.vue"
import { dateFormatter, dateTimeFormatter } from "@/utils/converter"
//api
import { listUser, delUser, updateUser } from "@/api/user/user"
//接口
import { UserInfo, UserId } from "@/interface/user/user"
import { Response, PageBean } from "@/interface/common/response"
import { SearchCondidtion } from "@/interface/common/search-condition"

//数据
const tableLoading = ref(false) //表格加载动画
const dialogVisible = ref(false) //对话框显示状态
const bindDialogVisible = ref(false) //用户角色对话框显示状态
const state = reactive<PageBean<Array<UserInfo>>>({}) //表格数据
const tableRef = ref<InstanceType<typeof ElTable>>() //表格引用
const rowRef = reactive<UserInfo>({}) //当前行引用
const isAdd = ref(false) // true添加false修改

//所有条件
const condidtion = [
    {
        key: "username",
        value: "",
        label: "用户名",
    },
    {
        key: "nick",
        value: "",
        label: "昵称",
    },
    {
        key: "phone",
        value: "",
        label: "手机号",
    },
    {
        key: "email",
        value: "",
        label: "邮箱",
    },
    {
        key: "remark",
        value: "",
        label: "备注",
    },
    {
        key: "status",
        label: "状态",
        value: "1",
        isState: true,
    },
    {
        key: "sex",
        label: "性别",
        value: "1",
        isState: true,
    },
    {
        key: "registerTime",
        label: "注册时间",
        isState: true,
        sort: 0,
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
//重置筛选条件
function resetCondidtion() {
    selectCondidtion.value = []
    getUserList()
}

//获取数据方法
const getUserList = throttle(function () {
    tableLoading.value = true
    listUser(state.pageIndex, state.pageSize, searchCondidtion.value).then((data: Response<PageBean<Array<UserInfo>>>) => {
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
//删除单行
function handleSingleDelete(id: number, rowIndex: number) {
    delUser([{ id: id }]).then((data: Response<string>) => {
        if (data.status === 200) {
            ElMessage.success(data.message)
            state.page.splice(rowIndex, 1)
        } else {
            ElMessage.error(data.message)
        }
    })
}
//删除选中行
function handleManyDelete() {
    const selectRow = tableRef.value?.getSelectionRows()
    //构造id序列
    const ids: Array<UserId> = []
    selectRow.forEach((element) => {
        ids.unshift({
            id: element.id,
        })
    })
    delUser(ids).then((data: Response<string>) => {
        if (data.status === 200) {
            ElMessage.success(data.message)
            state.page = state.page.filter((item: UserInfo) => {
                return ids.find((i: UserId) => i.id === item.id) !== item.id
            })
        } else {
            ElMessage.error(data.message)
        }
    })
}
//改变用户状态
const handleStatusChange = debounce(function (newVal, id) {
    updateUser({
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
//弹出修改对话框 mode true添加false修改
function handleDialogVisible(user: UserInfo, mode: boolean) {
    if (!mode) {
        rowRef.id = user.id
        rowRef.username = user.username
        rowRef.photo = `${process.env.VUE_APP_BASE_API}/user-service${user.photo}`
        rowRef.nick = user.nick
        rowRef.phone = user.phone
        rowRef.email = user.email
        rowRef.sex = user.sex
        rowRef.birthday = user.birthday
        rowRef.remark = user.remark
        rowRef.status = user.status
    } else {
        rowRef.id = null
        rowRef.username = null
        rowRef.photo = null
        rowRef.nick = null
        rowRef.phone = null
        rowRef.email = null
        rowRef.sex = null
        rowRef.birthday = null
        rowRef.remark = null
        rowRef.status = 1
    }
    isAdd.value = mode
    dialogVisible.value = true
}
//用户角色对话框显示
function handleBindDialogVisible(user: UserInfo) {
    rowRef.id = user.id
    rowRef.username = user.username
    bindDialogVisible.value = true
}
//日期格式化
function userDateFormatter(row: UserInfo) {
    if (row.birthday) return dateFormatter(row.birthday)
}
function registerTimeFormatter(row: UserInfo) {
    if (row.registerTime) return dateTimeFormatter(row.registerTime)
}
//性别格式化
function sexFormatter(row: UserInfo) {
    return row.sex === 1 ? "男" : row.sex === -1 ? "女" : ""
}

//监听页码页面尺寸
watch([() => state.pageIndex, () => state.pageSize], () => {
    getUserList()
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" }) //滚动到页面顶部
})

getUserList()
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

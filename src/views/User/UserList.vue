<template>
    <section>
        <el-card class="search" shadow="never">
            <template #header>
                <div class="header">
                    <p>条件搜索:</p>
                    <div class="search-card">
                        <el-select v-model="selectCondidtion" multiple class="select">
                            <el-option v-for="con in condidtion" :key="con.key" :value="con.key" :label="con.label" />
                        </el-select>
                        <el-button type="primary" @click="getUserList">搜索</el-button>
                    </div>
                </div>
            </template>
            <div class="values">
                <el-input v-for="con in searchCondidtion" :key="con.key" v-model="con.value" class="values-item" @keyup.enter="getUserList">
                    <template #prepend>
                        <span>{{ con.label }}</span>
                    </template>
                </el-input>
            </div>
        </el-card>
        <el-table :data="state.page" border ref="tableRef" v-loading="tableLoading">
            <el-table-column type="selection" fixed width="55" />
            <el-table-column prop="id" fixed label="编号" width="70"></el-table-column>
            <el-table-column prop="username" fixed label="登录名" width="150"></el-table-column>
            <el-table-column prop="nick" label="昵称" width="100"></el-table-column>
            <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="220"></el-table-column>
            <el-table-column prop="sex" label="性别" :formatter="sexFormatter" width="60"></el-table-column>
            <el-table-column prop="birthday" label="生日" :formatter="userDateFormatter" width="120"></el-table-column>
            <el-table-column prop="registerTime" label="注册时间" :formatter="userDateFormatter" width="120"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="score" label="积分" width="60"></el-table-column>
            <el-table-column prop="status" fixed="right" width="80" label="状态">
                <template #default="scope">
                    <el-switch size="large" @change="handleStatusChange($event, scope.row.id)" v-model="scope.row.status" inline-prompt :active-value="1" active-text="启用" :inactive-value="-1" inactive-text="禁用" />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
                <template #default="scope">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="handleDialogVisible(scope.row)">编辑</el-button>
                        <el-popconfirm title="您确定要删除这条记录吗" @confirm="handleSingleDelete(scope.row.id, scope.$index)">
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
        <footer class="footer">
            <el-popconfirm title="您确定要删除选中的记录吗" @confirm="handleManyDelete">
                <template #reference>
                    <el-button type="danger" size="small">批量删除</el-button>
                </template>
            </el-popconfirm>
            <el-pagination class="pageination" background layout="jumper, prev, pager, next , total ,sizes" :total="state.totalCount" v-model:currentPage="state.pageIndex" v-model:page-size="state.pageSize" />
        </footer>
        <el-dialog v-model="dialogVisible" title="修改用户信息">
            <EditorPanel :user="rowRef" @closeDialog="dialogVisible = false" @updateState="getUserList"></EditorPanel>
        </el-dialog>
    </section>
</template>

<script setup lang="ts">
import { reactive, watch, ref, computed } from "vue"
import { ElMessage, ElTable } from "element-plus"
import { listUser, delUser, updateUser } from "@/api/user"
import { UserInfo, UserId } from "@/interface/user"
import { Response, PageBean } from "@/interface/response"
import { SearchCondidtion } from "@/interface/search-condition"
import { debounce, throttle } from "lodash" //引入防抖节流
import EditorPanel from "./components/EditorPanel.vue"
import { dateFormatter } from "@/utils/converter"

//数据
const tableLoading = ref(false) //表格加载动画
const dialogVisible = ref(false) //对话框显示状态
const state = reactive<PageBean<Array<UserInfo>>>({}) //表格数据
const tableRef = ref<InstanceType<typeof ElTable>>() //表格引用
const rowRef = reactive<UserInfo>({}) //当前行引用

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
        key: "sex",
        label: "性别",
        value: "",
        isState: true,
    },
    {
        key: "remark",
        value: "",
        label: "备注",
    },
    {
        key: "status",
        label: "状态",
        value: "",
        isState: true,
    },
]
const selectCondidtion = ref(["username"]) //已选条件
const searchCondidtion = computed(() => getSearchCondidtion()) //动态计算已选中
function getSearchCondidtion(): Array<SearchCondidtion> {
    //筛选出已选中的
    return reactive(
        condidtion.filter((item) => {
            return selectCondidtion.value.indexOf(item.key) != -1
        })
    )
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
    delUser([{ Id: id }]).then((data: Response<string>) => {
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
            getUserList()
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
//弹出修改对话框
function handleDialogVisible(user: UserInfo) {
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
    dialogVisible.value = true
}
//日期格式化
function userDateFormatter(row: UserInfo) {
    return dateFormatter(row.birthday)
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

<style lang="scss">
.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
}
.header {
    display: flex;
    align-items: center;
}
.search {
    margin-bottom: 10px;
}
.search-card {
    white-space: nowrap;
}
.select {
    width: 550px;
    margin: 0px 10px 0px 10px;
}
.el-select__tags {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
}
.values-item {
    width: 35%;
    margin: 5px;
}
</style>

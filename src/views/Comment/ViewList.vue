<template>
    <section>
        <el-card class="search" shadow="never">
            <template #header>
                <span>条件搜索: </span>
                <el-select v-model="selectCondidtion" multiple class="select">
                    <el-option v-for="con in condidtion" :key="con.key" :value="con.key" :label="con.label" />
                </el-select>
                <el-button-group class="btn-group">
                    <el-button type="primary" @click="getUserViewHistoryList">搜索</el-button>
                    <el-button type="primary" @click="resetCondidtion">重置</el-button>
                </el-button-group>
            </template>
            <div class="values">
                <p v-for="con in searchCondidtion" :key="con.key">
                    <el-tooltip v-if="con.isState && con.key === 'viewTime'" :content="con.label" placement="bottom">
                        <el-radio-group v-model="con.sort">
                            <el-radio-button :label="1">{{ con.label }} 升序</el-radio-button>
                            <el-radio-button :label="-1">{{ con.label }} 降序</el-radio-button>
                        </el-radio-group>
                    </el-tooltip>
                    <el-input v-else class="values-item" v-model="con.value" @keyup.enter="getUserViewHistoryList">
                        <template #prepend>
                            <span>{{ con.label }}</span>
                        </template>
                    </el-input>
                </p>
            </div>
        </el-card>
        <el-table :data="state.page" border ref="tableRef" row-key="id" current-row-key="id" v-loading="tableLoading">
            <el-table-column prop="username" label="用户名/昵称" width="180">
                <template #default="scope">
                    <span>{{ scope.row.username }}/{{ scope.row.nick }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="ip" label="IP" min-width="80" />
            <el-table-column prop="articleTitle" label="文章标题" min-width="200" />
            <el-table-column prop="viewTime" label="访问时间" width="180" :formatter="viewTimeFormatter" />
            <template #empty>
                <el-empty description="什么也没有" />
            </template>
        </el-table>
        <footer class="footer">
            <el-pagination class="pageination" background layout="jumper, prev, pager, next , total ,sizes" :total="state.totalCount" v-model:currentPage="state.pageIndex" v-model:page-size="state.pageSize" />
        </footer>
    </section>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue"
import { ElMessage, ElTable } from "element-plus"
import { throttle } from "lodash" //引入防抖节流
import { dateTimeFormatter } from "@/utils/converter"
//接口
import { UserViewHistory } from "@/interface/comment/user-view-history"
import { SearchCondidtion } from "@/interface/common/search-condition"
import { PageBean, Response } from "@/interface/common/response"
//api
import { listUserViewHistory } from "@/api/comment/view"

const tableLoading = ref(false) //表格加载动画
const state = reactive<PageBean<Array<Comment>>>({}) //表格数据

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
        key: "articleTitle",
        value: "",
        label: "文章标题",
    },
    {
        key: "viewTime",
        label: "访问时间",
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
    getUserViewHistoryList()
}

//获取数据方法
const getUserViewHistoryList = throttle(function () {
    tableLoading.value = true
    listUserViewHistory(state.pageIndex, state.pageSize, searchCondidtion.value).then((data: Response<PageBean<Array<UserViewHistory>>>) => {
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

function viewTimeFormatter(row: UserViewHistory) {
    return dateTimeFormatter(row.viewTime)
}

//监听页码页面尺寸
watch([() => state.pageIndex, () => state.pageSize], () => {
    getUserViewHistoryList()
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" }) //滚动到页面顶部
})

getUserViewHistoryList()
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

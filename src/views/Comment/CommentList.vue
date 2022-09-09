<template>
    <section>
        <el-card class="search" shadow="never">
            <template #header>
                <span>条件搜索: </span>
                <el-select v-model="selectCondidtion" multiple class="select">
                    <el-option v-for="con in condidtion" :key="con.key" :value="con.key" :label="con.label" />
                </el-select>
                <el-button-group class="btn-group">
                    <el-button type="primary" @click="getCommentList">搜索</el-button>
                    <el-button type="primary" @click="selectCondidtion = []">重置</el-button>
                </el-button-group>
            </template>
            <div class="values">
                <p v-for="con in searchCondidtion" :key="con.key" class="values-item">
                    <el-radio-group v-if="con.isState && con.key === 'status'" v-model="con.value">
                        <el-radio-button :label="1">审核通过</el-radio-button>
                        <el-radio-button :label="-1">待审核</el-radio-button>
                    </el-radio-group>
                    <el-input v-else v-model="con.value" @keyup.enter="getCommentList">
                        <template #prepend>
                            <span>{{ con.label }}</span>
                        </template>
                    </el-input>
                </p>
            </div>
        </el-card>
        <el-table :data="state.page" border ref="tableRef" row-key="id" current-row-key="id" v-loading="tableLoading">
            <el-table-column type="selection" fixed width="55" />
            <el-table-column prop="content" label="评论" min-width="150" />
            <el-table-column prop="articleTitle" label="文章标题" min-width="200" />
            <el-table-column prop="username" label="用户名/昵称" width="180">
                <template #default="scope">
                    <span>{{ scope.row.username }}/{{ scope.row.nick }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="160" :formatter="createTimeFormatter"/>
            <el-table-column prop="status" fixed="right" width="100" label="状态">
                <template #default="scope">
                    <el-tag v-if="scope.row.status === -1" type="prmiary">待审核</el-tag>
                    <el-tag v-else-if="scope.row.status === 1" type="success">审核通过</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" width="150" label="操作">
                <template #default="scope">
                    <el-button-group>
                        <el-button type="success" size="small" v-if="scope.row.status === -1" @click="allowCommentStatus(scope.row.id)">审核</el-button>
                        <el-popconfirm title="您确定要删除这条评论吗" @confirm="deleteSingleComment(scope.row.id, scope.$index)">
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
            <div>
                <el-popconfirm title="您确定要删除选中的记录吗" @confirm="deleteManyComment">
                    <template #reference>
                        <el-button type="danger" size="small">批量删除</el-button>
                    </template>
                </el-popconfirm>
            </div>
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
import { Comment } from "@/interface/comment/comment"
import { SearchCondidtion } from "@/interface/common/search-condition"
import { PageBean, Response } from "@/interface/common/response"
//api
import { listComment, delComment, allowComment } from "@/api/comment/comment"

const tableLoading = ref(false) //表格加载动画
const state = reactive<PageBean<Array<Comment>>>({}) //表格数据
const tableRef = ref<InstanceType<typeof ElTable>>() //表格引用

//所有条件
const condidtion = [
    {
        key: "articleTitle",
        value: "",
        label: "文章标题",
    },
    {
        key: "content",
        value: "",
        label: "评论内容",
    },
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
        key: "status",
        value: "1",
        label: "状态",
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
const getCommentList = throttle(function () {
    tableLoading.value = true
    listComment(state.pageIndex, state.pageSize, searchCondidtion.value).then((data: Response<PageBean<Array<Comment>>>) => {
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

//改变评论状态
function allowCommentStatus(cid: number) {
    allowComment(cid).then((data: Response<string>) => {
        if (data.status === 200) {
            ElMessage.success(data.message)
            state.page.forEach((item: Comment) => {
                if (item.id === cid) {
                    item.status = 1
                }
            })
        } else {
            ElMessage.error(data.message)
        }
    })
}
//删除评论
function deleteSingleComment(cid: number, rowIndex: number) {
    delComment([cid]).then((data: Response<string>) => {
        if (data.status === 200) {
            setTimeout(() => {
                ElMessage.success(data.message)
                state.page.splice(rowIndex, 1)
            }, 1000)
        } else {
            ElMessage.error(data.message)
        }
    })
}
//批量删除评论
function deleteManyComment() {
    const selectRow = tableRef.value?.getSelectionRows()
    //构造id序列
    const ids: Array<number> = []
    selectRow.forEach((element) => {
        ids.unshift(element.id)
    })
    delComment(ids).then((data: Response<string>) => {
        if (data.status === 200) {
            ElMessage.success(data.message)
            state.page = state.page.filter((item: Comment) => {
                return ids.find((i) => i === item.id) !== item.id
            })
        } else {
            ElMessage.error(data.message)
        }
    })
}

function createTimeFormatter(row: Comment) {
    return dateTimeFormatter(row.createTime)
}

//监听页码页面尺寸
watch([() => state.pageIndex, () => state.pageSize], () => {
    getCommentList()
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" }) //滚动到页面顶部
})

getCommentList()
</script>

<style scoped>
.submit {
    display: flex;
    justify-content: flex-end;
}
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
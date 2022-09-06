<template>
    <section>
        <el-card class="search" shadow="never">
            <template #header>
                <span>条件搜索: </span>
                <el-select v-model="selectCondidtion" multiple class="select">
                    <el-option v-for="con in condidtion" :key="con.key" :value="con.key" :label="con.label" />
                </el-select>
                <el-button-group class="btn-group">
                    <el-button type="primary" @click="getArticleList">搜索</el-button>
                    <el-button type="primary" @click="selectCondidtion = []">重置</el-button>
                </el-button-group>
            </template>
            <div class="values">
                <p v-for="con in searchCondidtion" :key="con.key" class="values-item">
                    <el-radio-group v-if="con.isState && con.key === 'status'" v-model="con.value">
                        <el-radio-button :label="-1">待审核</el-radio-button>
                        <el-radio-button :label="1">已发布</el-radio-button>
                        <el-radio-button :label="2">私有</el-radio-button>
                        <el-radio-button :label="3">回收站</el-radio-button>
                    </el-radio-group>
                    <el-radio-group v-else-if="con.isState && con.key === 'commentStatus'" v-model="con.value">
                        <el-radio-button :label="-1">禁止评论</el-radio-button>
                        <el-radio-button :label="1">允许评论</el-radio-button>
                        <el-radio-button :label="2">需要审核</el-radio-button>
                    </el-radio-group>
                    <el-radio-group v-else-if="con.isState && con.key === 'isLock'" v-model="con.value">
                        <el-radio-button :label="-1">锁定</el-radio-button>
                        <el-radio-button :label="1">未锁定</el-radio-button>
                    </el-radio-group>
                    <el-input v-else v-model="con.value" @keyup.enter="getArticleList">
                        <template #prepend>
                            <span>{{ con.label }}</span>
                        </template>
                    </el-input>
                </p>
            </div>
        </el-card>
        <el-table :data="state.page" border ref="tableRef" current-row-key="id" v-loading="tableLoading">
            <el-table-column type="selection" fixed width="55" />
            <el-table-column prop="id" label="编号" />
            <el-table-column prop="username" label="作者" width="120" />
            <el-table-column prop="title" fixed label="文章标题" min-width="300" />
            <el-table-column prop="regionName" label="分区" min-width="90" />
            <el-table-column prop="createTime" label="发布时间" :formatter="createTimeFormatter" width="200"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" :formatter="updateTimeFormatter" width="200"></el-table-column>
            <el-table-column prop="status" fixed="right" width="90" label="状态">
                <template #default="scope">
                    <el-tag v-if="scope.row.status === -1" type="prmiary">待审核</el-tag>
                    <el-tag v-else-if="scope.row.status === 1" type="success">已发布</el-tag>
                    <el-tag v-else-if="scope.row.status === 2" type="error">私有</el-tag>
                    <el-tag v-else-if="scope.row.status === 3" type="info">回收站</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" prop="commentStatus" width="100" label="评论策略">
                <template #default="scope">
                    <el-tag v-if="scope.row.commentStatus === -1" type="error">禁止评论</el-tag>
                    <el-tag v-else-if="scope.row.commentStatus === 1" type="success">允许评论</el-tag>
                    <el-tag v-else-if="scope.row.commentStatus === 2" type="warning">需要审核</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" prop="isLock" width="90" label="是否锁定">
                <template #default="scope">
                    <el-tag v-if="scope.row.isLock === -1" type="error">锁定</el-tag>
                    <el-tag v-else-if="scope.row.isLock === 1" type="success">未锁定</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" width="180" label="操作">
                <template #default="scope">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="redirectEditorPanel(scope.row.id)">编辑</el-button>
                        <el-button type="success" size="small" @click="handleSettingDialogVisible(scope.row)">设置</el-button>
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
            <div>
                <el-popconfirm title="您确定要删除选中的记录吗" @confirm="handleManyDelete">
                    <template #reference>
                        <el-button type="danger" size="small">批量删除</el-button>
                    </template>
                </el-popconfirm>
            </div>
            <el-pagination class="pageination" background layout="jumper, prev, pager, next , total ,sizes" :total="state.totalCount" v-model:currentPage="state.pageIndex" v-model:page-size="state.pageSize" />
        </footer>
        <el-dialog v-model="dialogVisible" v-if="dialogVisible" :title="isAdd ? '添加用户' : '文章信息'">
            <ArticleSettingPanel :article="rowRef" :isEdit="true" @closeDialog="dialogVisible = false" @updateState="getArticleList"></ArticleSettingPanel>
        </el-dialog>
    </section>
</template>

<script setup lang="ts">
import { reactive, watch, ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { ElMessage, ElTable } from "element-plus"
import { listArticle, delArticle } from "@/api/article"
import { Article, ArticleId } from "@/interface/article"
import { Response, PageBean } from "@/interface/response"
import { SearchCondidtion } from "@/interface/search-condition"
import { throttle } from "lodash" //引入防抖节流
import ArticleSettingPanel from "./components/ArticleSettingPanel.vue"
import { dateTimeFormatter } from "@/utils/converter"

const router = useRouter()
//数据
const tableLoading = ref(false) //表格加载动画
const dialogVisible = ref(false) //对话框显示状态
const state = reactive<PageBean<Array<Article>>>({}) //表格数据
const tableRef = ref<InstanceType<typeof ElTable>>() //表格引用
const rowRef = reactive<Article>({}) //当前行引用

//所有条件
const condidtion = [
    {
        key: "username",
        value: "",
        label: "用户名",
    },
    {
        key: "title",
        value: "",
        label: "标题",
    },
    {
        key: "summary",
        value: "",
        label: "摘要",
    },
    {
        key: "region",
        value: "",
        label: "分区",
    },
    {
        key: "status",
        label: "状态",
        value: "1",
        isState: true,
    },
    {
        key: "isLock",
        label: "是否锁定",
        value: "1",
        isState: true,
    },
    {
        key: "commentStatus",
        label: "评论策略",
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
const getArticleList = throttle(function () {
    tableLoading.value = true
    listArticle(state.pageIndex, state.pageSize, searchCondidtion.value).then((data: Response<PageBean<Array<Article>>>) => {
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
    delArticle([{ id: id }]).then((data: Response<string>) => {
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
    const ids: Array<ArticleId> = []
    selectRow.forEach((element) => {
        ids.unshift({
            id: element.id,
        })
    })
    delArticle(ids).then((data: Response<string>) => {
        if (data.status === 200) {
            ElMessage.success(data.message)
            getArticleList()
        } else {
            ElMessage.error(data.message)
        }
    })
}

//初始化行数据
function initRowData(article: Article) {
    rowRef.id = article.id
    rowRef.title = article.title
    rowRef.userId = article.userId
    rowRef.summary = article.summary
    rowRef.photo = `${process.env.VUE_APP_BASE_API}/article-service${article.photo}`
    rowRef.regionId = article.regionId
    rowRef.regionName = article.regionName
    let tagIds = []
    article.tags.forEach((item) => {
        tagIds.unshift(item.id)
    })
    rowRef.tags = tagIds
    let categoryIds = []
    article.categorys.forEach((item) => {
        tagIds.unshift(item.id)
    })
    rowRef.categorys = categoryIds
    rowRef.status = article.status
    rowRef.isLock = article.isLock
    rowRef.commentStatus = article.commentStatus
}
//弹出修改对话框
function handleSettingDialogVisible(article: Article) {
    initRowData(article)
    dialogVisible.value = true
}
function redirectEditorPanel(aid: number) {
    router.push({
        path: "/article/editor",
        query: {
            articleId: aid,
            isEdit: true,
        },
    })
}

//日期格式化
function createTimeFormatter(row: Article) {
    return dateTimeFormatter(row.createTime)
}
function updateTimeFormatter(row: Article) {
    return dateTimeFormatter(row.createTime)
}

onMounted(() => {
    //监听页码页面尺寸
    watch([() => state.pageIndex, () => state.pageSize], () => {
        getArticleList()
        window.scrollTo({ left: 0, top: 0, behavior: "smooth" }) //滚动到页面顶部
    })
})

getArticleList()
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
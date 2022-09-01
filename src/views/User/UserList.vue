<template>
    <el-table> </el-table>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import { listUser } from "@/api/user"
import { UserList } from "@/interface/user"
import { PageNum } from "@/interface/page-num"

const data = reactive<UserList>([])
const page = reactive<PageNum>({
    pageIndex: 1,
    pageSize: 10,
    totalPage: 0,
    totalCount: 0,
})

function GetUserList():UserList {
    listUser().then(data => {
        
    })
}
</script>

<style></style>
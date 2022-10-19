<template>
    <ul class="count-view">
        <li>
            <h4>评论总数</h4>
            <p>{{ state.commentCount || 0 }}</p>
        </li>
        <li>
            <h4>待审核评论</h4>
            <p>{{ state.penddingCount || 0 }}</p>
        </li>
        <li>
            <h4>今日发布</h4>
            <p>{{ state.todayCount || 0 }}</p>
        </li>
        <li>
            <h4>昨日发布</h4>
            <p>{{ state.yesterdayCount || 0 }}</p>
        </li>
        <li>
            <h4>本周发布</h4>
            <p>{{ state.weekCount || 0 }}</p>
        </li>
        <li>
            <h4>本月发布</h4>
            <p>{{ state.monthCount || 0 }}</p>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import gsap from "gsap"
import { Response } from "@/interface/common/response"
import { CommentCountStatistics } from "@/interface/comment/statistics"
import { getCommentCount } from "@/api/comment/statistics"

const state = ref<CommentCountStatistics>({})

getCommentCount().then((data: Response<CommentCountStatistics>) => {
    if (data.status === 200) {
        state.value = data.result
    }
})
</script>

<style scoped>
.count-view {
    padding-inline-start: 0px;
    display: flex;
    list-style-type: none;

    align-items: center;
    flex-wrap: wrap;
}
.count-view li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    white-space: nowrap !important;
    padding: 20px;
}
.count-view li p {
    font-size: 30px;
}
</style>

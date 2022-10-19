<template>
    <ul class="count-view">
        <li>
            <h4>用户总数</h4>
            <p>{{ state.userCount || 0 }}</p>
        </li>
        <li>
            <h4>正常用户</h4>
            <p>{{ state.enableCount || 0 }}</p>
        </li>
        <li>
            <h4>禁用用户</h4>
            <p>{{ state.disableCount || 0 }}</p>
        </li>
        <li>
            <h4>今日新增</h4>
            <p>{{ state.todayCount || 0 }}</p>
        </li>
        <li>
            <h4>昨日新增</h4>
            <p>{{ state.yesterdayCount || 0 }}</p>
        </li>
        <li>
            <h4>本周新增</h4>
            <p>{{ state.weekCount || 0 }}</p>
        </li>
        <li>
            <h4>本月新增</h4>
            <p>{{ state.monthCount }}</p>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { Response } from "@/interface/common/response"
import { UserCountStatistics } from "@/interface/user/statistics"
import { getUserCount } from "@/api/user/statistics"

const state = ref<UserCountStatistics>({})

getUserCount().then((data: Response<UserCountStatistics>) => {
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

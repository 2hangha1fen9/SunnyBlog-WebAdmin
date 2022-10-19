<template>
    <el-card class="dashboard-card">
        <template #header>
            <span>用户增长趋势</span>
        </template>
        <div ref="view" class="echart"></div>
    </el-card>
</template>

<script setup lang="ts">
import * as echarts from "echarts"
import { onMounted, onUnmounted, reactive, ref } from "vue"
import { UserTrendStatistics } from "@/interface/user/statistics"
import { Response } from "@/interface/common/response"
import { dateFormatter } from "@/utils/converter"
import { getUserTrend } from "@/api/user/statistics"
import { ElMessage } from "element-plus"

type EChartsOption = echarts.EChartsOption
type EChartsType = echarts.EChartsType

const state = ref<Array<UserTrendStatistics>>([])
const view = ref()
//图标实例
let chartInstance: EChartsType = null
let chartOption: EChartsOption = null

function initChartData() {
    //初始化图表
    chartInstance = echarts.init(view.value)
    chartInstance.showLoading()
    chartOption = {
        tooltip: {
            //提示框触发位置，数据轴
            trigger: "axis",
        },
        toolbox: {
            //显示工具栏
            show: true,
            feature: {
                dataView: { readOnly: false },
                magicType: { type: ["line", "bar"] }, //切换视图
            },
        },
        xAxis: {
            //x轴数据
            name: "日期",
            type: "category",
            boundaryGap: true,
            data: [],
        },
        yAxis: {
            //y轴数据
            name: "新增用户",
            type: "value",
            minInterval: 1,
            max: 100,
        },
        dataZoom: [
            {
                type: "inside",
            },
        ],
        series: [
            //数据值
            {
                name: "新增用户",
                type: "line", //折线
                data: [], //数据
                areaStyle: {},
                markPoint: {
                    //显示极值点
                    data: [
                        { type: "max", name: "Max" },
                        { type: "min", name: "Min" },
                    ],
                },
                markLine: {
                    //显示平均线
                    data: [{ type: "average", name: "Avg" }],
                },
            },
        ],
    }
    chartInstance.setOption(chartOption)
}
onMounted(() => {
    initChartData()
    getUserTrend()
        .then((data: Response<Array<UserTrendStatistics>>) => {
            if (data.status === 200) {
                state.value = data.result
                chartInstance.hideLoading()
            } else {
                ElMessage.warning("数据拉取失败")
            }
        })
        .then(() => {
            chartInstance.setOption({
                xAxis: {
                    data: state.value.map((i) => dateFormatter(i.date)),
                },
                series: [
                    {
                        data: state.value.map((i) => i.userCount),
                    },
                ],
            })

            //响应式图标大小
            window.addEventListener("resize", () => {
                chartInstance.resize()
            })
        })
})

onUnmounted(() => {
    window.removeEventListener("resize", () => {
        chartInstance.resize()
    })
})
</script>

<style scoped>
.echart {
    width: 100%;
    height: 300px;
}
</style>

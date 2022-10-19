import request from '@/utils/request'

//获取文章统计数据
export function getUserCount() {
    return request({
        url: "/user-service/statistics/count",
        method: 'get'
    })
}
//获取文章趋势
export function getUserTrend() {
    return request({
        url: "/user-service/statistics/trend",
        method: 'get'
    })
}
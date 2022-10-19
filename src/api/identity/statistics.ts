import request from '@/utils/request'

//获取文章统计数据
export function getPermisssionCount() {
    return request({
        url: "/identity-service/api/statistics/count",
        method: 'get'
    })
}

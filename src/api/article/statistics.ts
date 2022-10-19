import request from '@/utils/request'

//获取文章统计数据
export function getArticleCount() {
    return request({
        url: "/article-service/statistics/count",
        method: 'get'
    })
}
//获取文章趋势
export function getArticleTrend() {
    return request({
        url: "/article-service/statistics/trend",
        method: 'get'
    })
}
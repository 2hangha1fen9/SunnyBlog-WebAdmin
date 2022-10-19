import request from '@/utils/request'

//获取评论统计数据
export function getCommentCount() {
    return request({
        url: "/comment-service/statistics/count",
        method: 'get'
    })
}

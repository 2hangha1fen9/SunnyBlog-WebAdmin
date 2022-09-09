import request from '@/utils/request'
import { SearchCondidtion } from '@/interface/common/search-condition'

//列出所有评论
export function listComment(pageIndex?: number | 1, pageSize?: number | 10, condition?: Array<SearchCondidtion>) {
    return request({
        url: '/comment-service/comment/all',
        method: 'get',
        params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            condition: JSON.stringify(condition)
        }
    })
}
//删除评论
export function delComment(cids: Array<number>) {
    return request({
        url: '/comment-service/comment/remove',
        method: 'delete',
        data: cids
    })
}
//审核评论
export function allowComment(cid: number) {
    return request({
        url: '/comment-service/comment/allow',
        method: 'put',
        params: {
            cid: cid
        }
    })
}
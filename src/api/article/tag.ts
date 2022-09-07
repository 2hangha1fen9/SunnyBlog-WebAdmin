import request from '@/utils/request'

//获取所有标签
export function listAllTag() {
    return request({
        url: '/article-service/manager/listTag',
        method: 'get'
    })
}
//获取公共标签
export function listPublicTag() {
    return request({
        url: '/article-service/tag/public',
        method: 'get'
    })
}
//获取用户个人标签
export function listUserTag(uid: number) {
    return request({
        url: '/article-service/manager/listUserTag',
        method: 'get',
        params: {
            uid: uid
        }
    })
}

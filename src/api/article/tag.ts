import request from '@/utils/request'
import { Tag,TagId } from '@/interface/article/tag'

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
//更新标签
export function updateTag(tag: Tag) {
    return request({
        url: '/article-service/manager/updateTag',
        method: 'put',
        data: tag
    })
}
//添加标签
export function addTag(tag: Tag) {
    return request({
        url: '/article-service/tag/create',
        method: 'post',
        data: tag
    })
}
//删除标签
export function delTag(ids: Array<TagId>){
    return request({
        url: '/article-service/manager/deleteTag',
        method: 'delete',
        data: ids
    })
}
import request from '@/utils/request'
import { Region, RegionId } from '@/interface/article/region'
//列出分区
export function listRegion() {
    return request({
        url: '/article-service/region/list',
        method: 'get'
    })
}
//列出所有分区
export function listAllRegion() {
    return request({
        url: '/article-service/region/listAll',
        method: 'get'
    })
}
//更新分区
export function updateRegion(region: Region) {
    return request({
        url: '/article-service/region/update',
        method: 'put',
        data: region
    })
}
//删除分区
export function delRegion(ids: Array<RegionId>) {
    return request({
        url: '/article-service/region/delete',
        method: 'delete',
        data: ids
    })
}
//添加分区
export function addRegion(region: Region) {
    return request({
        url: '/article-service/region/create',
        method: 'post',
        data: region
    })
}
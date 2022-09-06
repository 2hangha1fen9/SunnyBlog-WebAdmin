import request from '@/utils/request'
import { Tag, Category, Region, Article, ArticleId } from '@/interface/article'
import { SearchCondidtion } from '@/interface/search-condition'

//列出文章列表
export function listArticle(pageIndex?: number | 1, pageSize?: number | 10, condition?: Array<SearchCondidtion>) {
    return request({
        url: '/article-service/article/all',
        method: 'get',
        params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            condition: JSON.stringify(condition)
        }
    })
}
//修改文章
export function updateArticle(article: Article) {
    return request({
        url: '/article-service/manager/editorarticle',
        method: 'put',
        data: article
    })
}
//获取文章详情
export function getArticle(aid: number) {
    return request({
        url: '/article-service/article/detailIgnoreStatus',
        method: 'get',
        params: {
            id: aid
        }
    })
}
//删除文章
export function delArticle(ids: Array<ArticleId>) {
    return request({
        url: '/article-service/manager/removearticle',
        method: 'delete',
        data: ids
    })
}
//发布文章
export function publishArticle(article: Article) {
    return request({
        url: '/article-service/article/publish',
        method: 'post',
        data: article
    })
}
//上传图片
export function uploadPicture(formData: FormData, aid?: number, uid?: number) {
    return request({
        url: '/article-service/drawingBed/upload',
        method: 'put',
        headers: { 'Content-Type': 'multipart/form-data' },
        params: {
            aid: aid ?? '',
            uid: uid ?? ''
        },
        data: formData
    })
}

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
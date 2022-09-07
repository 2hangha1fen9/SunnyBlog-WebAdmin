import request from '@/utils/request'
import { Article, ArticleId } from '@/interface/article/article'
import { SearchCondidtion } from '@/interface/common/search-condition'

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
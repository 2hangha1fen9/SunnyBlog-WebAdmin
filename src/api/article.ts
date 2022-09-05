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
//删除文章
export function delArticle(ids: Array<ArticleId>) {
    return request({
        url: '/article-service/article/manager/removearticle',
        method: 'delete',
        data: ids
    })
}
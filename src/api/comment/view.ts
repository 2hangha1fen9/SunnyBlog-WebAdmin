import requeset from '@/utils/request'
import { SearchCondidtion } from '@/interface/common/search-condition'

export function listUserViewHistory(pageIndex?: number | 1, pageSize?: number | 10, condition?: Array<SearchCondidtion>) {
    return requeset({
        url: '/comment-service/view/allHistory',
        method: 'get',
        params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            condition: JSON.stringify(condition)
        }
    })
}
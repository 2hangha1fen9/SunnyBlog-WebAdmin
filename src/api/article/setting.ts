import request from '@/utils/request'

//列出所有设置项
export function listSetting() {
    return request({
        url: '/article-service/setting/list',
        method: 'get'
    })
}

//设置项
export function setValue(key: string, value: number) {
    return request({
        url: '/article-service/setting/update',
        method: 'put',
        params: {
            key: key,
            value: value
        }
    })
}
import request from '@/utils/request'

//获取设置
export function getConfig(key: string) {
    return request({
        url: "/article-service/siteconfig/getValue",
        method: 'get',
        params: {
            key: key
        }
    })
}

//更新设置
export function setConfig(key: string, value: string) {
    return request({
        url: "/article-service/siteconfig/setValue",
        method: 'put',
        data: {
            key: key,
            value: value
        }
    })
}


//删除设置
export function delConfig(key: string, value: string) {
    return request({
        url: "/article-service/siteconfig/delValue",
        method: 'delete',
        params: {
            key: key
        }
    })
}
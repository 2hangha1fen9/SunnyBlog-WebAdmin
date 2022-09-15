import request from '@/utils/request'

//列出所有设置项
export function listScoreUnit() {
    return request({
        url: '/user-service/score/listUnit',
        method: 'get'
    })
}

//设置项
export function setScoreUnit(key: string, value: number) {
    return request({
        url: '/user-service/score/setUnit',
        method: 'put',
        params: {
            key: key,
            value: value
        }
    })
}
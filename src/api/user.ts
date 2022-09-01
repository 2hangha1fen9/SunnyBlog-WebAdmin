import request from '@/utils/request'
import SendVCode from '@/interface/send-vcode'
import { SearchCondidtion } from '@/interface/search-condition'

export function sendVerificationCode(data: SendVCode) {
    return request({
        url: '/user-service/verify/sendvcode',
        method: 'post',
        data: data
    })
}

export function listUser(data: SearchCondidtion) {
    return request({
        url: '/user-service/manager/listuser',
        method: 'get',
        data: data
    })
}
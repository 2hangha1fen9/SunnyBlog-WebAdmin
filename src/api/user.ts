import request from '@/utils/request'
import sendVCode from '@/interface/send-vcode'
import { searchCondidtion } from '@/interface/search-condition'

export function sendVerificationCode(data: sendVCode) {
    return request({
        url: '/user-service/verify/sendvcode',
        method: 'post',
        data: data
    })
}

export function listUser(data: searchCondidtion) {
    return request({
        url: '/user-service/manager/listuser',
        method: 'get',
        data: data
    })
}
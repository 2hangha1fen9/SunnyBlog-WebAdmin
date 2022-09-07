import request from '@/utils/request'
import { SendVCode } from '@/interface/identity/vcode'

//发送验证码
export function sendVerificationCode(data: SendVCode) {
    return request({
        url: '/user-service/verify/sendvcode',
        method: 'post',
        data: data
    })
}
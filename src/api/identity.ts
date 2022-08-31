import request from '@/utils/request'
import qs from 'qs'
import { loginPayload } from '@/interface/user'

export function login(data: loginPayload){
    return request({
        url: '/identity-service/connect/token',
        method: 'post',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        data: qs.stringify(data)
    })
}
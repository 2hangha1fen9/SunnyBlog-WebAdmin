import request from '@/utils/request'
import qs from 'qs'
import { LoginPayload } from '@/interface/identity'

export function login(data: LoginPayload){
    return request({
        url: '/identity-service/connect/token',
        method: 'post',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        data: qs.stringify(data)
    })
}
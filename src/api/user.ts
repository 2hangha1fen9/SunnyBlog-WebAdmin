import request from '@/utils/request'
import SendVCode from '@/interface/send-vcode'
import { UserId, UserInfo } from '@/interface/user'
import { SearchCondidtion } from '@/interface/search-condition'

//发送验证码
export function sendVerificationCode(data: SendVCode) {
    return request({
        url: '/user-service/verify/sendvcode',
        method: 'post',
        data: data
    })
}
//上传头像
export function uploadAvatar(formData: FormData, uid?: number) {
    return request({
        url: 'user-service/photo/upload' + (uid ? `?uid=${uid}` : ''),
        method: 'put',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData
    })
}
//列出用户
export function listUser(pageIndex?: number | 1, pageSize?: number | 10, condition?: Array<SearchCondidtion>) {
    return request({
        url: '/user-service/manager/listuser',
        method: 'get',
        params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            condition: JSON.stringify(condition)
        }
    })
}
//删除用户
export function delUser(ids: Array<UserId>) {
    return request({
        url: "/user-service/manager/deluser",
        method: 'delete',
        data: ids
    })
}
//修改用户信息
export function updateUser(user: UserInfo) {
    return request({
        url: "/user-service/manager/modifyuser",
        method: 'put',
        data: user
    })
}
//添加用户
export function addUser(user: UserInfo) {
    return request({
        url: "/user-service/manager/adduser",
        method: 'post',
        data: user
    })
}
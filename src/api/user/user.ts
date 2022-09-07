import request from '@/utils/request'
import { UserId, UserInfo } from '@/interface/user/user'
import { SearchCondidtion } from '@/interface/common/search-condition'
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
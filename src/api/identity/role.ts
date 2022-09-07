import request from '@/utils/request'
import { Permission } from '@/interface/identity/permission'
import { RoleId, Role } from '@/interface/identity/role'
import { SearchCondidtion } from '@/interface/common/search-condition'

//列出权限列表
export function listRole(pageIndex?: number | 1, pageSize?: number | 10, condition?: Array<SearchCondidtion>) {
    return request({
        url: 'identity-service/api/role/list',
        method: 'get',
        params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            condition: JSON.stringify(condition)
        }
    })
}
//更新角色
export function updateRole(role: Permission) {
    return request({
        url: "/identity-service/api/role/modify",
        method: 'put',
        data: role
    })
}
//删除角色
export function delRole(ids: Array<RoleId>) {
    return request({
        url: "/identity-service/api/role/del",
        method: 'delete',
        data: ids
    })
}
//添加角色
export function addRole(role: Role) {
    return request({
        url: "/identity-service/api/role/add",
        method: 'post',
        data: role
    })
}
//列出用户已有角色
export function listUserRole(userId: number) {
    return request({
        url: '/identity-service/api/role/getbyuser',
        method: 'get',
        params: {
            pageSize: -1,
            id: userId
        }
    })
}
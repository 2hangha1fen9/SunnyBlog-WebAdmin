import request from '@/utils/request'
import {Permission } from '@/interface/identity/permission'
import { SearchCondidtion } from '@/interface/common/search-condition'

//列出权限列表
export function listPermission(pageIndex?: number | 1, pageSize?: number | 10, condition?: Array<SearchCondidtion>) {
    return request({
        url: '/identity-service/api/permission/list',
        method: 'get',
        params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            condition: JSON.stringify(condition)
        }
    })
}
//更新权限
export function updatePermission(permission: Permission) {
    return request({
        url: "/identity-service/api/permission/modify",
        method: 'put',
        data: permission
    })
}
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
//列出角色已有权限
export function listRolePermission(roleId: number) {
    return request({
        url: "/identity-service/api/permission/getbyrole",
        method: 'get',
        params: {
            pageSize: -1,
            id: roleId
        }
    })
}
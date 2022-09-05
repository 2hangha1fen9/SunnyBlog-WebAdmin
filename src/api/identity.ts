import request from '@/utils/request'
import qs from 'qs'
import { LoginPayload, Permission, RoleId, Role, RolePermissionBind, UserRoleBind } from '@/interface/identity'
import { SearchCondidtion } from '@/interface/search-condition'
//登录
export function login(data: LoginPayload) {
    return request({
        url: '/identity-service/connect/token',
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data)
    })
}
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
//角色权限绑定
export function rolePermissionBind(rpb: RolePermissionBind) {
    return request({
        url: "/identity-service/api/relation/rolePermissionBind",
        method: 'post',
        data: rpb
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
//用户角色绑定
export function userRoleBind(urb: UserRoleBind) {
    return request({
        url: '/identity-service/api/relation/userRoleBind',
        method: 'post',
        data: urb
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
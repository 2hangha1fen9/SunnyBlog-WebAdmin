import request from '@/utils/request'
import { RolePermissionBind, UserRoleBind } from '@/interface/identity/relation'

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
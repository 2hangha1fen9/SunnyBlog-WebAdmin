//角色权限绑定
export interface RolePermissionBind {
    roleId: number
    permissionIds: Array<number>
}
//用户角色绑定
export interface UserRoleBind {
    userId: number
    roleIds: Array<number>
}
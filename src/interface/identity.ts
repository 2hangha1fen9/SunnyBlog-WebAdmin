export interface Jwt {
    jwt: {
        token: string
        expiration: number
    }
}

export interface JwtPayload {
    exp: number
    user_id: number
    user_name: string
    user_nick: string
    user_photo: string
}

//token请求响应
export interface Token {
    access_token: string
    expires_in: number
    token_type: string
    scope: string
}

//登录请求
export interface LoginPayload {
    client_id: string
    grant_type: string
    username: string
    password: string
}
//权限
export interface Permission {
    id: number
    service: string
    controller: string
    action: string
    description: string
    updateTime: string
    createTime: string
    status: number
    isPublic: number
}
//角色
export interface Role {
    id: number
    name: string
    status: number
    isDefault: number
    createTime: string
    updateTime: string
}
//删除ID序列
export interface RoleId {
    id: number
}
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
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
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
//用户详情
export interface UserInfo {
    id: number
    username: string
    password: string
    nick?: string
    phone?: string
    email?: string
    sex?: number
    birthday?: string
    registerTime?: string
    remark?: string
    score: number
    photo?: string
    status: number
}

//删除ID序列
export interface UserId {
    id: number
}
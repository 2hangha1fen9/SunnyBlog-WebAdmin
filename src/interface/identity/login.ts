//登录请求
export interface LoginPayload {
    client_id: string
    grant_type: string
    username: string
    password: string
}
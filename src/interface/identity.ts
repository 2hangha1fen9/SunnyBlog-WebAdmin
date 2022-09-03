export interface Jwt {
    jwt: {
        token: string
        expiration: number
    }
}

export interface JwtPayload {
    exp:number
    user_id:number
    user_name:string
    user_nick:string
    user_photo:string
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

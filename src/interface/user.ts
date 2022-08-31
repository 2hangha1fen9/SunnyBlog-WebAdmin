export interface user {
    token: string,
    info: {
        user_id: number
        user_name: string
        user_nick?: string
        user_photo?: string
    }
}
export interface loginPayload{
    client_id:string
    grant_type:string
    username:string
    password:string
}
export interface token {
    access_token: string
    expires_in: number
    token_type: string
    scope: string
}

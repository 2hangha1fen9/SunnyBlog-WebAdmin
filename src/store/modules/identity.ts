import { Jwt, JwtPayload, Token } from '@/interface/identity/jwt'
import jwtDecode from 'jwt-decode'
const state: Jwt = {
    jwt: JSON.parse(localStorage.getItem('jwt') ?? '{"token":"","expiration":0}') as Jwt['jwt']
}
const mutations = {
    SET_JWT(state: Jwt, data: Jwt) {
        state.jwt = data.jwt
        localStorage.jwt = JSON.stringify(data.jwt)
    },
    REMOVE_JWT(state: Jwt) {
        state.jwt.token = ''
        state.jwt.expiration = 0
        localStorage.removeItem('jwt')
    }
}
const actions = {
    login({ commit }: any, payload: Token) {
        const { exp } = jwtDecode<JwtPayload>(payload.access_token)
        const jwt: Jwt = {
            jwt: {
                token: payload.access_token,
                expiration: exp
            }
        }
        commit('SET_JWT', jwt)
    },
    logout({ commit }: any) {
        commit('REMOVE_JWT')
    }
}
const getters = {
    token(state: Jwt): string {
        if (getters.isValid(state)) {
            return state.jwt.token
        }
        return ''
    },
    userId(state: Jwt) {
        if (getters.isValid(state)) {
            const { user_id } = jwtDecode<JwtPayload>(getters.token(state))
            return user_id
        }
    },
    username(state: Jwt) {
        if (getters.isValid(state)) {
            const { user_name, user_nick } = jwtDecode<JwtPayload>(getters.token(state))
            return user_nick || user_name
        }
    },
    nick(state: Jwt) {
        if (getters.isValid(state)) {
            const { user_nick } = jwtDecode<JwtPayload>(getters.token(state))
            return user_nick
        }
    },
    photo(state: Jwt) {
        if (getters.isValid(state)) {
            const { user_photo } = jwtDecode<JwtPayload>(getters.token(state))
            return `${process.env.VUE_APP_BASE_API}/user-service${user_photo}`
        }
    },
    isValid(state: Jwt): boolean {
        if (!state) return false
        const timestamp = Math.round(new Date().getTime() / 1000) //获取当前unix时间戳
        const expiration = state.jwt.expiration //获取token有效期
        if (timestamp > expiration) {
            return false
        }
        return true
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
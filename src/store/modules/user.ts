import { User, Token } from '@/interface/user'
import jwtDecode from 'jwt-decode'
const state: User = {
    token: localStorage.getItem('token') as string ?? '',
    info: JSON.parse(<any>localStorage.getItem('info')) as User['info'] ?? {
        user_id: 0,
        user_name: '',
        user_nick: '',
        user_photo: ''
    }
}
const mutations = {
    //存放token
    SET_TOKEN(state: User, token: string) {
        state.token = token
        //持久化到localStorage
        localStorage.token = token
    },
    //设置用户信息
    SET_INFO(state: User, info: User['info']) {
        state.info = info
        localStorage.info = JSON.stringify(info)
    },
    //移除token
    REMOVE_TOKEN(state: User) {
        state.token = ''
        localStorage.removeItem('token')
    },
    //重置用户信息
    RESET_INFO(state: User) {
        let info = state.info
        info.user_id = 0
        info.user_name = ''
        info.user_nick = ''
        info.user_photo = ''
        localStorage.removeItem('info')
    }
}
const actions = {
    login({ commit }: any, payload: Token) {
        commit('SET_TOKEN', payload.access_token)
        let jwt: any = jwtDecode(payload.access_token)
        let info: User['info'] = {
            user_id: jwt.user_id,
            user_name: jwt.user_name,
            user_nick: jwt.user_nick,
            user_photo: `${process.env.VUE_APP_BASE_API}/user-service${jwt.user_photo}`
        }
        commit('SET_INFO', info)
    },
    logout({ commit }: any) {
        commit('REMOVE_TOKEN')
        commit('RESET_INFO')
    },

}
const getters = {
    token(state: User) {
        return state.token
    },
    userId(state: User) {
        return state.info.user_id
    },
    username(state: User) {
        return state.info.user_name
    },
    nick(state: User) {
        return state.info.user_nick
    },
    photo(state: User) {
        return state.info.user_photo
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
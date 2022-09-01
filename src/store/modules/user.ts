import { user, token } from '@/interface/user'
import jwtDecode from 'jwt-decode'
const state: user = {
    token: localStorage.getItem('token') as string ?? '',
    info: JSON.parse(<any>localStorage.getItem('info')) as user['info'] ?? {
        user_id: 0,
        user_name: '',
        user_nick: '',
        user_photo: ''
    }
}
const mutations = {
    //存放token
    SET_TOKEN(state: user, token: string) {
        state.token = token
        //持久化到localStorage
        localStorage.token = token
    },
    //设置用户信息
    SET_INFO(state: user, info: user['info']) {
        state.info = info
        localStorage.info = JSON.stringify(info)
    },
    //移除token
    REMOVE_TOKEN(state: user) {
        state.token = ''
        localStorage.removeItem('token')
    },
    //重置用户信息
    RESET_INFO(state: user) {
        let info = state.info
        info.user_id = 0
        info.user_name = ''
        info.user_nick = ''
        info.user_photo = ''
        localStorage.removeItem('info')
    }
}
const actions = {
    login({ commit }: any, payload: token) {
        commit('SET_TOKEN', payload.access_token)
        let jwt: any = jwtDecode(payload.access_token)
        let info: user['info'] = {
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
    token(state: user) {
        return state.token
    },
    userId(state: user) {
        return state.info.user_id
    },
    username(state: user) {
        return state.info.user_name
    },
    nick(state: user) {
        return state.info.user_nick
    },
    photo(state: user) {
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
import App from '@/interface/common/app'
const state: App = {
    sidebar: {
        //!!+ 字符串转boolean
        opened: localStorage.getItem('sidebarStatus') ? !!+(localStorage.getItem('sidebarStatus') ?? '') : true,
    }
}
const mutations = {
    SET_STATUS: (state: App, flag: boolean) => {
        state.sidebar.opened = flag
        localStorage.setItem('sidebarStatus', flag ? "1" : "0")
    },
    TOGGLE_SIDEBAR: (state: App) => {
        //对状态取反
        state.sidebar.opened = !state.sidebar.opened
        if (state.sidebar.opened) {
            localStorage.setItem('sidebarStatus', "1")
        } else {
            localStorage.setItem('sidebarStatus', "0")
        }
    },
    CLOSE_SIDEBAR: (state: App) => {
        state.sidebar.opened = true
        localStorage.setItem('sidebarStatus', "0")
    }
}
const actions = {
    //切换侧边栏状态
    toggleSideBar({ commit }: any) {
        commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }: any) {
        commit('CLOSE_SIDEBAR')
    },
    setStatus({ commit }: any, flag: boolean) {
        commit('SET_STATUS', flag)
    }
}
const getters = {
    sidebar: (state: App) => state.sidebar
}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
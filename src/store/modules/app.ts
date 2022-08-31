import app from '@/interface/app'
const state:app = {
    sidebar:{
        //!!+ 字符串转boolean
        opened: localStorage.getItem('sidebarStatus') ? !!+<any>localStorage.getItem('sidebarStatus') : true,
    }
}
const mutations = {
    TOGGLE_SIDEBAR: (state:app) => {
        //对状态取反
        state.sidebar.opened = !state.sidebar.opened 
        if(state.sidebar.opened){
            localStorage.setItem('sidebarStatus',"1")
        }else{
            localStorage.setItem('sidebarStatus',"0")
        }
    },
    CLOSE_SIDEBAR:(state:app) => {
        state.sidebar.opened = true
        localStorage.setItem('sidebarStatus',"0")
    }
}
const actions ={
    //切换侧边栏状态
    toggleSideBar({commit}:any){
        commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({commit}:any){
        commit('CLOSE_SIDEBAR')
    }
}
const getters = {
    sidebar: (state:app) => state.sidebar
}
export default{
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
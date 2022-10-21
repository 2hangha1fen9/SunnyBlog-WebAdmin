import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/transition.scss'
//全局路由守卫
import '@/router/router-guard'
//引入自定义图标
import SvgIcon from '@/components/SvgIcon.vue'
import '@/icons'
//全局事件总线
import mitt from 'mitt'
//全局事件总线注册
const Bus = mitt()
declare module 'vue' {
    export interface ComponentCustomProperties {
        $bus: typeof Bus
    }
}

const app = createApp(App)
app.use(store)
app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.config.globalProperties.$bus = Bus
//引入自定义图标组件
app.component('svg-icon', SvgIcon)
app.mount('#app')




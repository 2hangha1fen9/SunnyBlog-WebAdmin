import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/transition.scss'
import '@/router/router-guard'
//引入自定义图标
import SvgIcon from '@/components/SvgIcon.vue'
//全局路由守卫
import '@/icons'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(ElementPlus, { locale: zhCn })
//引入自定义图标组件
app.component('svg-icon', SvgIcon)
app.mount('#app')




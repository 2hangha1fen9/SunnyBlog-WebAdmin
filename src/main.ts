import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/transition.scss'
//引入自定义图标
import SvgIcon from '@/components/SvgIcon.vue'

import '@/icons'
const app = createApp(App)
app.use(store)
app.use(router)
app.use(ElementPlus)
//引入自定义图标组件
app.component('svg-icon', SvgIcon)
app.mount('#app')


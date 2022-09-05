import router from './index'
import { start, close } from '@/utils/progress'
import { ElMessage } from 'element-plus'
import store from '@/store/index'
import { computed } from 'vue'

const token = computed(() => store.getters['identity/token'])

//路由白名单
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
    start() //开启进度条
    if (token.value) {
        //如果已经登录了则跳转
        next()
        close()
    }
    else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            //清除所有信息跳转到登录页
            await store.dispatch('identity/logout')
            ElMessage.warning('凭证过期')
            next(`/login?redirect=${to.path}`)
            close()
        }
    }
})

router.afterEach(() => {
    close()
})
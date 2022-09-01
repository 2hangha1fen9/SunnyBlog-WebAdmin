import axios from 'axios'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { computed } from 'vue'
const store = useStore()
const token = computed(() => store.getters['user/token'])

//创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, //api网关
    timeout: 10000 //请求超时时间10s
})

//request拦截器
service.interceptors.request.use(config => {
    //让每一个请求都带上jwt
    if (config && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

//response拦截器
service.interceptors.response.use(
    response => {
        const res = response.data
        if (response.status !== 200) {
            ElMessage({
                message: res.message,
                type: 'error'
            })
            return Promise.reject('error')
        }
        return response.data
    },
    error => {
        if (error.message == "Request failed with status code 401") {
            ElMessage({
                message: '请先登录',
                type: 'warning',
            })
            store.dispatch('user/logout')
        }
        else if (error.message == "Request failed with status code 400") {
            ElMessage({
                message: '鉴权失败',
                type: 'warning',
            })
        }
        else {
            ElMessage({
                message: '系统异常，请稍候再试。异常详情：' + error.message,
                type: 'error',
            })
        }
        return Promise.reject(error)
    }
)

export default service
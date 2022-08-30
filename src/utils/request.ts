import axios from 'axios'

//创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, //api网关
    timeout: 10000 //请求超时时间10s
})

//request拦截器
service.interceptors.request.use(config => {
    
})
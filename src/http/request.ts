// 创建新的axios对象
import axios from 'axios'
const _axios = axios.create({
    baseURL:  "",
    withCredentials: true,


})
// 请求拦截器
// 可以自请求发送前对请求做一些处理
_axios.interceptors.request.use((config: any) => {
    //接受JSON数据格式
    // config.headers['Content-Type'] = 'application/json;charset=utf-8';
    // 设置请求头
    // config.headers['Authorization'] = localStorage.getItem("token");

    return config
}, (error: any) => {
    return Promise.reject(error)
});

// 响应拦截器
_axios.interceptors.response.use(
    (response: any) => {
        // 状态码 2xx
        return response
    },
    (err: { status: number; }) => {
        // 处理异常
        console.error(err)
        if (err.status === 401) {

        } else if (err.status === 404) {

        } else if (err.status === 405) {

        } else if (err.status === 500) {

        }

        return Promise.resolve({})
    }
)
export default _axios
export const dataUrl = "/api";
// export const dataUrl = "";



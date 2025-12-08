import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';

// API基础地址，根据实际情况修改
const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const service: AxiosInstance = axios.create({
    baseURL: baseURL,  // 配置基础URL
    timeout: 30000,    // 增加超时时间到30秒
    headers: {
        'Content-Type': 'application/json'
    }
});

service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 从localStorage获取token并添加到请求头
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers['hswatersession'] = token;
        }
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        // 返回响应数据
        if (response.status === 200) {
            return response.data;
        } else {
            return Promise.reject(response);
        }
    },
    (error: AxiosError) => {
        console.error('请求错误:', error);
        
        let errorMessage = '网络请求失败';
        
        if (error.code === 'ECONNABORTED') {
            // 超时错误
            errorMessage = '请求超时，请检查网络连接或API地址配置';
        } else if (error.code === 'ERR_NETWORK') {
            // 网络错误
            errorMessage = '网络连接失败，请检查网络或API地址是否正确';
        } else if (error.response) {
            // 服务器返回了错误状态码
            const status = error.response.status;
            switch (status) {
                case 400:
                    errorMessage = '请求参数错误';
                    break;
                case 401:
                    errorMessage = '未授权，请重新登录';
                    break;
                case 403:
                    errorMessage = '拒绝访问';
                    break;
                case 404:
                    errorMessage = '请求的资源不存在';
                    break;
                case 500:
                    errorMessage = '服务器内部错误';
                    break;
                default:
                    errorMessage = `服务器错误: ${status}`;
            }
        } else if (error.request) {
            // 请求已发送但没有收到响应
            errorMessage = '服务器无响应，请检查API地址配置';
        }
        
        // 添加错误对象的message
        if (error.message) {
            errorMessage += ` (${error.message})`;
        }
        
        ElMessage.error(errorMessage);
        return Promise.reject(error);
    }
);

export default service;

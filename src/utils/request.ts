import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';

// API基础地址
const baseURL = import.meta.env.VITE_API_BASE_URL || '';

// 缓存token和过期时间
let cachedToken: string | null = null;
let tokenExpireTime: number = 0;
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// 获取token的函数（独立的axios实例，避免循环依赖）
const getNewToken = async (): Promise<string | null> => {
    // 防止并发请求时重复获取token
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }
    
    isRefreshing = true;
    refreshPromise = (async () => {
        try {
            console.log('正在获取新token...');
            const response = await axios({
                url: 'https://culture.xianzanwl.com/dm/auth/getToken',
                method: 'POST',
                data: {
                    userName: 'dm13918177314',
                    userPwd: 'a13918177314'
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('getToken响应:', response.data);
            
            if (response.data.code === 200 && response.data.data) {
                cachedToken = response.data.data;
                // token有效期设为50秒（实际60秒，提前10秒刷新）
                tokenExpireTime = Date.now() + 50 * 1000;
                console.log('获取新token成功:', cachedToken?.substring(0, 50) + '...');
                return cachedToken;
            }
            console.error('获取token失败:', response.data.msg);
            return null;
        } catch (error) {
            console.error('获取token请求失败:', error);
            return null;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();
    
    return refreshPromise;
};

// 强制刷新token
const forceRefreshToken = async (): Promise<string | null> => {
    cachedToken = null;
    tokenExpireTime = 0;
    isRefreshing = false;
    refreshPromise = null;
    return await getNewToken();
};

// 获取有效token（如果过期则自动刷新）
const getValidToken = async (): Promise<string | null> => {
    // 检查缓存的token是否有效
    if (cachedToken && Date.now() < tokenExpireTime) {
        return cachedToken;
    }
    
    // 获取新token
    return await getNewToken();
};

const service: AxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

service.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // 获取有效token
        const token = await getValidToken();
        console.log('请求URL:', config.url, '使用token:', token?.substring(0, 30) + '...');
        if (token && config.headers) {
            config.headers['token'] = token;
        }
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    async (response: AxiosResponse) => {
        if (response.status === 200) {
            const data = response.data;
            
            // 检查业务错误码：500表示token过期或无权限
            if (data.code === 500 && data.msg === 'No permission to access!') {
                console.log('Token过期，尝试刷新...');
                
                // 强制刷新token
                const newToken = await forceRefreshToken();
                if (newToken) {
                    // 重新发起请求
                    const config = response.config;
                    config.headers['token'] = newToken;
                    console.log('使用新token重试请求:', config.url);
                    return service(config);
                }
            }
            
            return data;
        } else {
            return Promise.reject(response);
        }
    },
    (error: AxiosError) => {
        console.error('请求错误:', error);
        
        let errorMessage = '网络请求失败';
        
        if (error.code === 'ECONNABORTED') {
            errorMessage = '请求超时，请检查网络连接或API地址配置';
        } else if (error.code === 'ERR_NETWORK') {
            errorMessage = '网络连接失败，请检查网络和API地址是否正确';
        } else if (error.response) {
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
            errorMessage = '服务器无响应，请检查API地址配置';
        }
        
        if (error.message) {
            errorMessage += ` (${error.message})`;
        }
        
        ElMessage.error(errorMessage);
        return Promise.reject(error);
    }
);

export default service;

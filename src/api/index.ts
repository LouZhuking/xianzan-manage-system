import request from '../utils/request';

// 定义登录参数接口
interface LoginParams {
    userName: string;
    userPwd: string;
}

// 定义token响应接口
interface TokenResponse {
    json_ok: boolean;
    json_msg: string;
    data: {
        accessToken: string;
        [key: string]: any;
    };
}

/**
 * 获取token接口
 * @param params 登录参数，包含userName和userPwd
 * @returns Promise<TokenResponse> 返回token数据
 */
export const getToken = (params: LoginParams): Promise<TokenResponse> => {
    return request({
        url: 'https://culture.xianzanwl.com/dm/auth/getToken',
        method: 'post',
        data: params
    });
};

// 定义账号登录参数接口（常见格式）
interface LoginByAccountParams {
    account: string;      // 账号
    password: string;     // 密码
}

/**
 * 账号登录接口
 * @param params 登录参数，包含account和password
 * @returns Promise<TokenResponse> 返回token数据
 * @description 
 * 方式1：配置 .env.development 中的 VITE_API_BASE_URL，使用相对路径 '/user/loginByAccount'
 * 方式2：直接在这里使用完整URL替换 url 字段
 * 例如：url: 'https://api.example.com/user/loginByAccount'
 */
export const loginByAccount = (params: LoginByAccountParams): Promise<TokenResponse> => {
    // 如果有环境变量配置的baseURL，使用相对路径
    // 否则需要在这里配置完整的API地址
    const apiUrl = import.meta.env.VITE_API_BASE_URL 
        ? '/user/loginByAccount'  // 相对路径，会拼接baseURL
        : 'https://culture.xianzanwl.com/dm/user/loginByAccount';  // 完整URL
    
    return request({
        url: apiUrl,
        method: 'post',
        data: params
    });
};

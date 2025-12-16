import request from '../utils/request';

// 定义登录参数接口
interface LoginParams {
    userName: string;
    userPwd: string;
}

// 定义token响应接口（后端实际返回格式）
interface TokenResponse {
    code: number;         // 状态码，200表示成功，500表示错误
    msg: string;          // 返回消息
    data: string;         // token字符串（注意：data 直接就是 token，不是对象）
    trackId?: string;     // 追踪ID（可选）
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

// 定义账号登录参数接口（后端要求的格式）
interface LoginByAccountParams {
    user: string;         // 用户账号
    userPwd: string;      // 密码
}

// 定义登录响应接口
interface LoginResponse {
    code: number;
    msg: string;
    data: {
        userInfo: {
            id: number;
            user: string;
            userPwd: string;
            userName: string;
            roleId: number;
            dealerId: number;
            createOn: number;
        };
    };
}

/**
 * 账号登录接口
 * @param params 登录参数，包含user和userPwd
 * @param token 从getToken获取的token
 * @returns Promise<LoginResponse> 返回用户信息
 * @description 
 * 需要先调用 getToken 获取 token，然后在 header 中携带 token 调用此接口
 * 参数通过 Query 方式传递
 */
export const loginByAccount = (params: LoginByAccountParams, token: string): Promise<LoginResponse> => {
    return request({
        url: 'https://culture.xianzanwl.com/dm/user/loginByAccount',
        method: 'post',
        params: params,  // 使用 params 作为 Query 参数
        headers: {
            'token': token
        }
    });
};

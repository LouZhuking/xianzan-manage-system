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

// 设备信息接口（后端返回格式）
export interface DeviceItem {
    id: number;
    deviceName: string;
    deviceCode: string;
    deviceStatus: string;
    createOn: number;
    updateOn: number;
    dealerId: number;
}

// 供应商信息接口（后端返回格式）
export interface DealerItem {
    id: number;
    dealerName: string;
    deviceList: DeviceItem[];
}

// 供应商列表响应接口
interface DealerListResponse {
    code: number;
    msg: string;
    data: DealerItem[];
    trackId?: string;
}

/**
 * 获取供应商设备列表接口
 * @param user 用户账号（必填）
 * @returns Promise<DealerListResponse> 返回供应商及其设备列表
 */
export const getDealerDeviceList = (user: string): Promise<DealerListResponse> => {
    console.log('请求供应商列表，user:', user);
    
    return request({
        url: 'https://culture.xianzanwl.com/dm/device/list',
        method: 'get',
        params: { user }
    });
};

/**
 * 设备状态响应接口
 * @description 根据设备编码获取设备实时状态
 * 
 * 接口地址: GET https://culture.xianzanwl.com/dm/device/{code}
 * 
 * 响应字段说明:
 * - partList: 设备部件状态列表
 *   - partId: 部件ID
 *   - partName: 部件名称（如"网络信号"）
 *   - partNum: 当前值（网络信号为0-4）
 *   - partTotal: 总值
 *   - partStatus: 状态（"正常"/"异常"）
 */
export interface DeviceStatusResponse {
    code: number;
    msg: string;
    data: {
        deviceCode: string;
        deviceName: string;
        deviceStatus: string;
        partList: Array<{
            partId: number;
            partName: string;
            partNum: number;
            partTotal: number;
            partStatus: string;
        }>;
    } | null;
    trackId?: string;
}

/**
 * 获取设备状态接口
 * @param deviceCode 设备编码
 * @returns Promise<DeviceStatusResponse> 返回设备状态数据
 * @description 
 * - 从 partList 中查找 partName === '网络信号' 的项
 * - partNum 为 0 或 1 时，设备状态为"离线中"
 * - partNum 为 2、3、4 时，设备状态为"运行中"
 * - partNum 的值直接对应网络信号格数（0-4格）
 */
export const getDeviceStatus = (deviceCode: string): Promise<DeviceStatusResponse> => {
    return request({
        url: `https://culture.xianzanwl.com/dm/device/${deviceCode}`,
        method: 'get'
    });
};

/**
 * 设备概况响应接口
 * @description 获取设备总览统计数据，包括故障警告和更换维护统计
 * 
 * 接口地址: GET https://culture.xianzanwl.com/dm/device/overview
 */
export interface DeviceOverviewResponse {
    code: number;
    msg: string;
    data: {
        totalDevices: number;            // 总设备数
        runningDevices: number;          // 运行中设备数
        faultMaintenanceDevices: number; // 故障维护设备数
        deviceStats: {
            cameraCount: number;         // 摄像头总数
            displayCount: number;        // 显示屏总数
            printerCount: number;        // 打印机总数
            cutterCount: number;         // 膜切机总数
            networkCount: number;        // 网络设备总数
        };
        faultWarningStats: {
            cameraFault: number;         // 摄像头故障数
            displayFault: number;        // 显示屏故障数
            printerFault: number;        // 打印机故障数
            cutterFault: number;         // 膜切机故障数
            networkFault: number;        // 网络信号故障数
        };
        maintenanceStats?: {
            bladeCount: number;          // 刀头维护数
            paperCount: number;          // 纸张维护数
            ribbonCount: number;         // 色带维护数
        };
    };
    trackId?: string;
}

/**
 * 获取设备概况接口
 * @param user 用户账号（必填）
 * @returns Promise<DeviceOverviewResponse> 返回设备概况统计数据
 */
export const getDeviceOverview = (user: string): Promise<DeviceOverviewResponse> => {
    return request({
        url: 'https://culture.xianzanwl.com/dm/device/overview',
        method: 'get',
        params: { user }
    });
};

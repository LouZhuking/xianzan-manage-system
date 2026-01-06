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
 * @param dealerName 供应商名称（可选，如 "tinghua"，不传则返回所有供应商的概况）
 * @returns Promise<DeviceOverviewResponse> 返回设备概况统计数据
 */
export const getDeviceOverview = (user: string, dealerName?: string): Promise<DeviceOverviewResponse> => {
    const params: { user: string; dealerName?: string } = { user };
    if (dealerName) {
        params.dealerName = dealerName;
    }
    return request({
        url: 'https://culture.xianzanwl.com/dm/device/overview',
        method: 'get',
        params
    });
};

/**
 * 故障记录项接口
 * @description 实际接口返回的数据结构
 */
export interface FaultRecordItem {
    id: number;
    deviceCode: string;
    downTime: string;       // 故障时间
    partName: string;       // 故障类型：网络信号、摄像头、显示屏、膜切机、打印机
    partStatus: string;     // 状态：故障、正常（正常表示已修复）
    repairTime: string | null;  // 修复时间，null表示未修复
}

/**
 * 故障记录分页数据接口
 */
export interface FaultRecordPageData {
    total: number;
    list: FaultRecordItem[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
}

/**
 * 故障记录响应接口
 * @description 获取设备故障记录列表
 * 
 * 接口地址: GET https://culture.xianzanwl.com/dm/device/fault-records
 * 接口ID: 396665216
 */
export interface FaultRecordsResponse {
    code: number;
    msg: string;
    data: FaultRecordPageData;
    trackId?: string;
}

/**
 * 获取故障记录接口
 * @param deviceCode 设备编码（必填）
 * @param page 页码（可选）
 * @param size 每页数量（可选）
 * @returns Promise<FaultRecordsResponse> 返回故障记录列表
 */
export const getFaultRecords = (deviceCode: string, page?: number, size?: number): Promise<FaultRecordsResponse> => {
    const params: { deviceCode: string; page?: number; size?: number } = { deviceCode };
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    return request({
        url: 'https://culture.xianzanwl.com/dm/device/fault-records',
        method: 'get',
        params
    });
};


/**
 * 维护记录项接口
 * @description 实际接口返回的数据结构
 */
export interface MaintenanceRecordItem {
    id: number;
    deviceCode: string;
    maintenanceType: string;      // 维护类型：刀头、色带、纸张
    maintenanceStatus: string;    // 维护状态：维护完成、待维护
    maintenanceTime: string;      // 维护时间
    remark: string | null;        // 备注
    processResult: string | null; // 处理结果
    createOn: string;
    updateOn: string;
}

/**
 * 维护记录分页数据接口
 */
export interface MaintenanceRecordPageData {
    total: number;
    list: MaintenanceRecordItem[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
}

/**
 * 维护记录响应接口
 * @description 获取设备维护记录列表
 * 
 * 接口地址: GET https://culture.xianzanwl.com/dm/device/maintenance-records
 * 接口ID: 396832973
 */
export interface MaintenanceRecordsResponse {
    code: number;
    msg: string;
    data: MaintenanceRecordPageData;
    trackId?: string;
}

/**
 * 获取维护记录接口
 * @param deviceCode 设备编码（必填）
 * @param page 页码（可选）
 * @param size 每页数量（可选）
 * @returns Promise<MaintenanceRecordsResponse> 返回维护记录列表
 */
export const getMaintenanceRecords = (deviceCode: string, page?: number, size?: number): Promise<MaintenanceRecordsResponse> => {
    const params: { deviceCode: string; page?: number; size?: number } = { deviceCode };
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    return request({
        url: 'https://culture.xianzanwl.com/dm/device/maintenance-records',
        method: 'get',
        params
    });
};


/**
 * 创建维护记录请求参数接口
 * @description POST /device/maintenance-records 接口参数
 * 接口ID: 396767078
 */
export interface CreateMaintenanceRecordParams {
    deviceCode: string;           // 设备ID
    maintenanceType: string;      // 维护类型：刀头、色带、纸张
    remark: string;               // 备注
    processResult?: string;       // 处理结果：已处理
    maintenanceStatus?: string;   // 维护状态（备选字段名）
}

/**
 * 创建维护记录响应接口
 */
export interface CreateMaintenanceRecordResponse {
    code: number;
    msg: string;
    data: MaintenanceRecordItem | null;
    trackId?: string;
}

/**
 * 创建维护记录接口
 * @param params 维护记录参数
 * @returns Promise<CreateMaintenanceRecordResponse> 返回创建结果
 */
export const createMaintenanceRecord = (params: CreateMaintenanceRecordParams): Promise<CreateMaintenanceRecordResponse> => {
    return request({
        url: 'https://culture.xianzanwl.com/dm/device/maintenance-records',
        method: 'post',
        data: params
    });
};

/**
 * 设备营收流水项接口（旧接口，保留兼容）
 * @description 设备营收详细数据
 * 
 * 接口地址: GET https://culture.xianzanwl.com/dm/revenue/device-revenue-flow
 * 接口ID: 396303438
 */
export interface DeviceRevenueFlowItem {
    deviceName: string;      // 设备名称
    userCount: number;       // 使用人数
    dealUserCount: number;   // 成交人数
    totalRevenue: number;    // 总流水
    stickerRevenue?: number; // 萌化贴纸收入
    portraitRevenue?: number;// 人物转绘收入
    travelRevenue?: number;  // 萌版文旅收入
}

/**
 * 设备营收流水响应接口
 */
export interface DeviceRevenueFlowResponse {
    code: number;
    msg: string;
    data: DeviceRevenueFlowItem[];
    trackId?: string;
}

/**
 * 获取设备营收流水接口
 * @param user 用户账号（必填）
 * @param timeRange 时间范围（可选）: yesterday-昨天, week-近7天, month-近30天
 * @returns Promise<DeviceRevenueFlowResponse> 返回设备营收流水列表
 */
export const getDeviceRevenueFlow = (user: string, timeRange?: string): Promise<DeviceRevenueFlowResponse> => {
    const params: { user: string; timeRange?: string } = { user };
    if (timeRange) {
        params.timeRange = timeRange;
    }
    return request({
        url: 'https://culture.xianzanwl.com/dm/revenue/device-revenue-flow',
        method: 'get',
        params
    });
};

/**
 * 查询设备详细金额项接口
 * @description 根据供应商和时间范围查询设备详细金额
 * 
 * 接口地址: GET https://culture.xianzanwl.com/dm/revenue/device-revenue-flow
 * 接口ID: 396303438
 */
export interface DeviceDetailAmountItem {
    deviceName: string;                    // 设备名称
    deviceCode: string;                    // 设备编码
    userCount: number;                     // 使用人数
    dealUserCount: number;                 // 成交人数
    totalRevenue: number;                  // 总流水
    orderTypeAmounts: Record<string, number>; // 各风格金额，如 { "萌化贴纸": 60, "文旅AI": 30 }
}

/**
 * 查询设备详细金额响应数据接口
 */
export interface DeviceDetailAmountData {
    list: DeviceDetailAmountItem[];
}

/**
 * 查询设备详细金额响应接口
 */
export interface DeviceDetailAmountResponse {
    code: number;
    msg: string;
    data: DeviceDetailAmountData;
    trackId?: string;
}

/**
 * 查询设备详细金额接口
 * @param dateRange 时间范围（必填）: yesterday-昨天, last7days-近7天, last30days-近30天
 * @param dealerName 供应商名称（可选，如 "tinghua"，不传则查询全部供应商）
 * @param deviceCode 设备编码（可选，传入则查询单个设备的数据）
 * @returns Promise<DeviceDetailAmountResponse> 返回设备详细金额列表
 */
export const getDeviceDetailAmount = (dateRange: string, dealerName?: string, deviceCode?: string): Promise<DeviceDetailAmountResponse> => {
    const params: { dateRange: string; dealerName?: string; deviceCode?: string } = { dateRange };
    if (dealerName) {
        params.dealerName = dealerName;
    }
    if (deviceCode) {
        params.deviceCode = deviceCode;
    }
    return request({
        url: 'https://culture.xianzanwl.com/dm/revenue/device-revenue-flow',
        method: 'get',
        params
    });
};

/**
 * 订单统计数据项接口
 */
export interface OrderNameStat {
    orderName: string;   // 订单名称（如"萌化贴纸"、"文旅AI"等）
    amount: number;      // 金额
    count: number;       // 次数
}

/**
 * 订单统计响应数据接口
 */
export interface OrderStatisticsData {
    totalAmount: number;           // 成交金额
    totalCount: number;            // 成交人数
    orderNameStats: OrderNameStat[]; // 各风格统计
}

/**
 * 订单统计响应接口
 * @description 风格次数金额查询
 * 
 * 接口地址: POST https://culture.xianzanwl.com/dm/order/statistics
 * 接口ID: 397490004
 */
export interface OrderStatisticsResponse {
    code: number;
    msg: string;
    data: OrderStatisticsData;
    trackId?: string;
}

/**
 * 获取订单统计接口
 * @param dealerName 供应商名称（可选，如 "tinghua"）
 * @param timeRange 时间范围（可选，如 "today"）
 * @param deviceCode 设备编码（可选，传入则查询单个设备的统计数据）
 * @returns Promise<OrderStatisticsResponse> 返回订单统计数据
 */
export const getOrderStatistics = (dealerName?: string, timeRange?: string, deviceCode?: string): Promise<OrderStatisticsResponse> => {
    const data: { dealerName?: string; timeRange?: string; deviceCode?: string } = {};
    if (dealerName) {
        data.dealerName = dealerName;
    }
    if (timeRange) {
        data.timeRange = timeRange;
    }
    if (deviceCode) {
        data.deviceCode = deviceCode;
    }
    return request({
        url: 'https://culture.xianzanwl.com/dm/order/statistics',
        method: 'post',
        data  // POST 请求应使用 data 而非 params
    });
};

/**
 * 当天订单流水项接口
 * @description 查询当天订单流水
 * 
 * 接口地址: GET https://culture.xianzanwl.com/dm/revenue/today-orders
 * 接口ID: 397419077
 */
export interface TodayOrderItem {
    id: number;
    orderNo: string;           // 订单号
    orderName: string;         // 订单名称（如"萌化贴纸"、"文旅AI"等）
    zje: number;               // 总金额
    bl: string;                // 比例
    yj: number;                // 佣金
    payCode: string;           // 支付代码
    orderType: string;         // 订单类型
    deviceId: string;          // 设备ID
    deviceCode: string;        // 设备编码
    createOn: string;          // 创建时间
    updateOn: string;          // 更新时间
}

/**
 * 当天订单流水响应接口
 */
export interface TodayOrdersResponse {
    code: number;
    msg: string;
    data: TodayOrderItem[];
    trackId?: string;
}

/**
 * 获取当天订单流水接口
 * @param dealerName 供应商名称（可选，如 "tinghua"，不传则查询全部供应商）
 * @param deviceCode 设备编码（可选，传入则查询单个设备的订单流水）
 * @returns Promise<TodayOrdersResponse> 返回当天订单流水列表
 */
export const getTodayOrders = (dealerName?: string, deviceCode?: string): Promise<TodayOrdersResponse> => {
    const params: { dealerName?: string; deviceCode?: string } = {};
    if (dealerName) {
        params.dealerName = dealerName;
    }
    if (deviceCode) {
        params.deviceCode = deviceCode;
    }
    return request({
        url: 'https://culture.xianzanwl.com/dm/revenue/today-orders',
        method: 'get',
        params
    });
};

/**
 * 订单查询项接口
 * @description 订单查询接口返回的订单数据结构
 * 
 * 接口地址: POST https://culture.xianzanwl.com/dm/order/search
 * 接口ID: 276137306
 */
export interface OrderSearchItem {
    orderNo: string;        // 订单编号（对应表格中的"设备编号"）
    orderName: string;      // 订单名称（风格类型）
    zje: number;            // 订单总金额
    bl: string;             // 佣金比例
    yj: number;             // 佣金
    payCode: string;        // 支付方式代码：00-支付宝，01-微信
    orderType: string;      // 订单类型：00-正常，01-退款
    deviceCode: string;     // 设备编码（对应表格中的"设备名称"）
    createOn: string;       // 下单时间
}

/**
 * 订单查询分页数据接口
 */
export interface OrderSearchPageData {
    total: number;
    list: OrderSearchItem[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
}

/**
 * 订单查询响应接口
 */
export interface OrderSearchResponse {
    code: number;
    msg: string;
    data: OrderSearchPageData;
    trackId?: string;
}

/**
 * 订单查询请求参数接口
 */
export interface OrderSearchParams {
    dealerName: string;      // 供应商名称（必填）
    pageNum?: number;        // 页码
    pageSize?: number;       // 每页数量
    orderNo?: string;        // 订单编号（可选筛选）
    payCode?: string;        // 支付方式（可选筛选）：00-支付宝，01-微信
    orderType?: string;      // 订单类型（可选筛选）：00-正常，01-退款
    orderName?: string;      // 风格类型（可选筛选）：如"萌化贴纸"、"文旅AI"等
    startDate?: string;      // 开始日期（可选筛选）
    endDate?: string;        // 结束日期（可选筛选）
    deviceCode?: string;     // 设备编码（可选筛选）
}

/**
 * 订单查询接口（支持筛选）
 * @param params 查询参数
 * @returns Promise<OrderSearchResponse> 返回订单列表
 * @description
 * 接口地址: POST https://culture.xianzanwl.com/dm/order/searchByDealer
 * 接口ID: 397078804
 * 
 * - deviceCode 对应表格中的"设备名称"
 * - orderNo 对应表格中的"订单编号"
 * - payCode: 00-支付宝，01-微信
 * - orderType: 00-正常，01-退款
 */
export const searchOrders = (params: OrderSearchParams): Promise<OrderSearchResponse> => {
    return request({
        url: 'https://culture.xianzanwl.com/dm/order/searchByDealer',
        method: 'post',
        data: params  // POST请求使用data传递参数
    });
};


/**
 * 总营收响应接口
 * @description 查询账户总营收金额
 * 
 * 接口地址: GET https://culture.xianzanwl.com/dm/revenue/total
 */
export interface TotalRevenueResponse {
    code: number;        // 状态码，200表示成功
    msg: string;         // 返回消息
    data: number;        // 总营收金额
    trackId?: string;    // 追踪ID
}

/**
 * 获取总营收接口
 * @param dealerName 供应商名称（可选，如 "tinghua"，不传则查询全部供应商）
 * @param deviceCode 设备编码（可选，传入则查询单个设备的账户金额）
 * @returns Promise<TotalRevenueResponse> 返回总营收金额
 */
export const getTotalRevenue = (dealerName?: string, deviceCode?: string): Promise<TotalRevenueResponse> => {
    const params: { dealerName?: string; deviceCode?: string } = {};
    if (dealerName) {
        params.dealerName = dealerName;
    }
    if (deviceCode) {
        params.deviceCode = deviceCode;
    }
    return request({
        url: 'https://culture.xianzanwl.com/dm/revenue/total',
        method: 'get',
        params
    });
};


/**
 * 设备部件信息接口
 * @description 设备部件状态数据
 */
export interface DevicePartInfo {
    partId: number;        // 部件ID
    partName: string;      // 部件名称
    partNum: number;       // 当前值
    partTotal: number;     // 总值
    partStatus: string;    // 状态
}

/**
 * 设备器械详细信息接口
 * @description 获取设备器械信息接口返回的数据结构
 * 
 * 接口地址: GET https://culture.xianzanwl.com/dm/device/{code}
 * 接口ID: 275821756
 */
export interface DeviceInfoData {
    deviceCode: string;           // 设备编码
    deviceName: string;           // 设备名称
    deviceStatus: string;         // 设备状态：运行中、离线中
    deviceAddress: string;        // 设备地址
    softwareVersion: string;      // 软件版本
    hardwareVersion: string;      // 硬件版本
    networkCarrier: string;       // 网络运营商
    totalTraffic: number | null;  // 总流量
    monthlyTraffic: number | null;// 月流量
    partList: DevicePartInfo[];   // 部件列表
}

/**
 * 设备器械信息响应接口
 */
export interface DeviceInfoResponse {
    code: number;
    msg: string;
    data: DeviceInfoData | null;
    trackId?: string;
}

/**
 * 获取设备器械信息接口
 * @param deviceCode 设备编码（必填）
 * @returns Promise<DeviceInfoResponse> 返回设备器械详细信息
 * @description
 * 接口地址: GET https://culture.xianzanwl.com/dm/device/{code}
 * 接口ID: 275821756
 * 
 * 返回字段说明:
 * - deviceCode: 设备编码
 * - deviceName: 设备名称
 * - deviceStatus: 设备状态（运行中/离线中）
 * - deviceAddress: 设备安装地址
 * - softwareVersion: 软件版本号
 * - hardwareVersion: 硬件版本号
 * - networkCarrier: 网络运营商
 * - totalTraffic: 总流量
 * - monthlyTraffic: 月流量
 * - partList: 设备部件状态列表
 */
export const getDeviceInfo = (deviceCode: string): Promise<DeviceInfoResponse> => {
    return request({
        url: `https://culture.xianzanwl.com/dm/device/${deviceCode}`,
        method: 'get'
    });
};

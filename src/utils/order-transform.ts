import type { OrderSearchItem } from '@/api/index';

/**
 * 前端订单表格数据接口
 */
export interface OrderItem {
    orderNo: string;        // 订单编号
    deviceName: string;     // 设备名称（来自 deviceCode）
    styleType: string;      // 风格类型（来自 orderName）
    amount: number | null;  // 单价（来自 zje）
    status: string;         // 订单状态（转换自 orderType）
    payMethod: string;      // 支付方式（转换自 payCode）
    createTime: string;     // 下单时间
}

/**
 * 支付方式代码映射
 * @param payCode 支付方式代码：00-支付宝，01-微信
 * @returns 支付方式中文名称
 */
export const mapPayCode = (payCode: string): string => {
    const map: Record<string, string> = {
        '00': '支付宝',
        '01': '微信'
    };
    return map[payCode] || payCode;
};

/**
 * 订单类型代码映射
 * @param orderType 订单类型代码：00-正常（已完成），01-退款
 * @returns 订单状态标识
 */
export const mapOrderType = (orderType: string): string => {
    const map: Record<string, string> = {
        '00': 'completed',   // 已完成
        '01': 'refunded'     // 退款成功
    };
    return map[orderType] || 'pending';
};

/**
 * 金额格式化
 * @param amount 金额数值
 * @returns 格式化后的金额字符串，如 "¥36.00"
 */
export const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) {
        return '-';
    }
    return `¥${amount.toFixed(2)}`;
};

/**
 * 将 API 返回的订单数据转换为前端表格数据格式
 * @param list API 返回的订单列表
 * @returns 转换后的前端订单列表
 */
export const transformOrderData = (list: OrderSearchItem[]): OrderItem[] => {
    return list.map(item => ({
        orderNo: item.orderNo,
        deviceName: item.deviceCode,      // deviceCode 映射到设备名称
        styleType: item.orderName || '',  // orderName 映射到风格类型
        amount: item.zje ?? null,         // zje 映射到单价
        status: mapOrderType(item.orderType),
        payMethod: mapPayCode(item.payCode),
        createTime: item.createOn || ''   // createOn 映射到下单时间
    }));
};

/**
 * 前端筛选状态转换为 API orderType 参数
 * @param status 前端状态值：completed, refunded, pending
 * @returns API orderType 参数：00, 01, 或空字符串
 */
export const mapStatusToOrderType = (status: string): string => {
    const map: Record<string, string> = {
        'completed': '00',
        'refunded': '01'
    };
    return map[status] || '';
};

/**
 * 前端风格类型转换为 API orderName 参数
 * @param styleType 前端风格类型：cute-萌化贴纸
 * @returns API orderName 参数
 */
export const mapStyleTypeToOrderName = (styleType: string): string => {
    const map: Record<string, string> = {
        'cute': '萌化贴纸',
        'travel': '文旅AI'
    };
    return map[styleType] || '';
};


/**
 * 前端支付方式转换为 API payCode 参数
 * @param payMethod 前端支付方式：alipay, wechat
 * @returns API payCode 参数：00, 01, 或空字符串
 */
export const mapPayMethodToPayCode = (payMethod: string): string => {
    const map: Record<string, string> = {
        'alipay': '00',
        'wechat': '01'
    };
    return map[payMethod] || '';
};

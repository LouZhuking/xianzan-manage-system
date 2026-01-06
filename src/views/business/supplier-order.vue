<template>
    <div class="container">
        <!-- 顶部设备信息卡片 -->
        <div class="device-info-card" v-loading="deviceInfoLoading">
            <div class="device-main">
                <div class="device-header">
                    <span class="device-code">{{ deviceInfo.deviceCode }}</span>
                    <el-tag :type="getStatusTagType(deviceInfo.deviceStatus)" size="small" class="status-tag">
                        {{ deviceInfo.deviceStatus }}
                    </el-tag>
                </div>
                <div class="device-id">ID: {{ deviceInfo.deviceName || '--' }}</div>
            </div>
            <div class="device-detail">
                <el-icon><Location /></el-icon>
                <div class="detail-content">
                    <div class="detail-label">设备地址</div>
                    <div class="detail-value">{{ deviceInfo.deviceAddress }}</div>
                </div>
            </div>
            <div class="device-detail">
                <el-icon><Monitor /></el-icon>
                <div class="detail-content">
                    <div class="detail-label">软件版本</div>
                    <div class="detail-value">{{ deviceInfo.softwareVersion }}</div>
                </div>
            </div>
            <div class="device-detail">
                <el-icon><Setting /></el-icon>
                <div class="detail-content">
                    <div class="detail-label">硬件版本</div>
                    <div class="detail-value">{{ deviceInfo.hardwareVersion }}</div>
                </div>
            </div>
        </div>

        <!-- 订单管理区域 -->
        <div class="order-section">
            <!-- 页面标题 -->
            <div class="page-header">
                <span class="header-icon">|</span>
                <span class="header-title">订单管理</span>
                <el-icon class="export-icon"><Download /></el-icon>
            </div>

            <!-- 搜索和筛选区域 -->
            <div class="filter-box">
                <div class="filter-row">
                    <div class="filter-item">
                        <span class="filter-label">统计时间</span>
                        <el-date-picker
                            v-model="query.dateRange"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="YYYY-MM-DD"
                            style="width: 220px"
                        />
                    </div>
                    <div class="filter-item">
                        <span class="filter-label">订单编号</span>
                        <el-input 
                            v-model="query.orderNo" 
                            placeholder="请输入"
                            clearable
                            style="width: 160px"
                        />
                    </div>
                    <div class="filter-item">
                        <span class="filter-label">订单状态</span>
                        <el-select v-model="query.status" placeholder="请选择" clearable style="width: 120px">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="已完成" value="completed"></el-option>
                            <el-option label="待处理" value="pending"></el-option>
                            <el-option label="退款成功" value="refunded"></el-option>
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <span class="filter-label">风格类型</span>
                        <el-select v-model="query.styleType" placeholder="请选择" clearable style="width: 120px">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="萌化贴纸" value="cute"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="filter-row">
                    <div class="filter-item">
                        <span class="filter-label">支付方式</span>
                        <el-select v-model="query.payMethod" placeholder="请选择" clearable style="width: 120px">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="支付宝" value="alipay"></el-option>
                            <el-option label="微信" value="wechat"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="filter-actions">
                    <el-button type="warning" @click="handleSearch">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </div>
            </div>

            <!-- 订单列表表格 -->
            <el-table 
                :data="tableData" 
                class="table" 
                header-cell-class-name="table-header"
                v-loading="loading"
            >
                <el-table-column prop="deviceName" label="设备名称" align="center" min-width="120">
                    <template #default="scope">
                        <span class="device-indicator"></span>
                        <span>{{ scope.row.deviceName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="orderNo" label="订单编号" align="center" min-width="200">
                    <template #default="scope">
                        <span>{{ scope.row.orderNo }}</span>
                        <el-icon class="copy-icon" @click="handleCopy(scope.row.orderNo)"><DocumentCopy /></el-icon>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="下单时间" align="center" min-width="160"></el-table-column>
                <el-table-column prop="styleType" label="风格类型" align="center" min-width="100">
                    <template #default="scope">
                        <span>{{ scope.row.styleType || '-' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="amount" label="单价" align="center" min-width="100">
                    <template #default="scope">
                        <span v-if="scope.row.amount">¥{{ scope.row.amount.toFixed(2) }}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="payMethod" label="支付方式" align="center" min-width="100"></el-table-column>
                <el-table-column prop="status" label="订单状态" align="center" min-width="100">
                    <template #default="scope">
                        <span :class="['status-text', scope.row.status]">
                            {{ getStatusText(scope.row.status) }}
                        </span>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
                <span class="total-text">共{{ pageTotal }}条</span>
                <el-pagination
                    background
                    layout="prev, pager, next, sizes, jumper"
                    :current-page="query.pageNum"
                    :page-size="query.pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange"
                />
                <span class="page-suffix">页</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="supplier-order">
import { ref, reactive, computed, onMounted, onActivated, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Download, DocumentCopy, Location, Monitor, Setting } from '@element-plus/icons-vue';
import { searchOrders, getDeviceInfo, type OrderSearchItem, type DeviceInfoData } from '@/api/index';
import { useSidebarStore } from '@/store/sidebar';

// 定义表格展示数据接口
interface OrderDisplayItem {
    orderNo: string;        // 订单编号
    deviceName: string;     // 设备名称（来自deviceCode）
    styleType: string;      // 风格类型（来自orderName）
    amount: number | null;  // 单价（来自zje）
    status: string;         // 订单状态
    payMethod: string;      // 支付方式
    createTime: string;     // 下单时间
    commission: number;     // 佣金（来自yj）
    commissionRate: string; // 佣金比例（来自bl）
}

// 设备信息展示数据接口
interface DeviceDisplayInfo {
    deviceCode: string;
    deviceName: string;
    deviceStatus: string;
    deviceAddress: string;
    softwareVersion: string;
    hardwareVersion: string;
}

// 使用 sidebar store 获取当前选中的设备
const sidebarStore = useSidebarStore();

// 从 sidebar store 获取当前设备编码
const currentDeviceCode = computed(() => {
    console.log('计算 currentDeviceCode...');
    console.log('activeDevice:', sidebarStore.activeDevice);
    console.log('deviceList:', sidebarStore.deviceList);
    
    // 优先从 activeDevice 获取设备信息
    if (sidebarStore.activeDevice) {
        // 从设备列表中找到对应的设备获取 deviceCode
        const deviceList = sidebarStore.deviceList;
        const activeDeviceId = sidebarStore.activeDevice.id;
        console.log('查找设备, activeDeviceId:', activeDeviceId);
        const device = deviceList.find(d => d.id === activeDeviceId);
        console.log('找到的设备:', device);
        if (device?.deviceCode) {
            return device.deviceCode;
        }
    }
    // 如果没有选中设备，返回设备列表第一个设备的编码
    if (sidebarStore.deviceList.length > 0) {
        console.log('使用第一个设备:', sidebarStore.deviceList[0]);
        return sidebarStore.deviceList[0].deviceCode;
    }
    return '';
});

// 设备信息数据
const deviceInfo = ref<DeviceDisplayInfo>({
    deviceCode: '--',
    deviceName: '--',
    deviceStatus: '未知',
    deviceAddress: '--',
    softwareVersion: '--',
    hardwareVersion: '--'
});
const deviceInfoLoading = ref(false);

// 获取状态标签类型
export const getStatusTagType = (status: string): string => {
    if (status === '运行中') return 'success';
    if (status === '离线中') return 'info';
    return 'warning';
};

// 获取设备信息
const fetchDeviceInfo = async () => {
    if (!currentDeviceCode.value) return;
    
    deviceInfoLoading.value = true;
    try {
        const res = await getDeviceInfo(currentDeviceCode.value);
        if (res.code === 200 && res.data) {
            deviceInfo.value = {
                deviceCode: res.data.deviceCode || '--',
                deviceName: res.data.deviceName || '--',
                deviceStatus: res.data.deviceStatus || '未知',
                deviceAddress: res.data.deviceAddress || '--',
                softwareVersion: res.data.softwareVersion || '--',
                hardwareVersion: res.data.hardwareVersion || '--'
            };
        } else {
            console.error('获取设备信息失败:', res.msg);
            // 重置为默认值
            deviceInfo.value = {
                deviceCode: '--',
                deviceName: '--',
                deviceStatus: '未知',
                deviceAddress: '--',
                softwareVersion: '--',
                hardwareVersion: '--'
            };
        }
    } catch (error) {
        console.error('获取设备信息失败:', error);
        // 重置为默认值
        deviceInfo.value = {
            deviceCode: '--',
            deviceName: '--',
            deviceStatus: '未知',
            deviceAddress: '--',
            softwareVersion: '--',
            hardwareVersion: '--'
        };
    } finally {
        deviceInfoLoading.value = false;
    }
};

// 监听设备编码变化，重新获取数据
watch(currentDeviceCode, (newCode, oldCode) => {
    console.log('currentDeviceCode 变化:', oldCode, '->', newCode);
    if (newCode) {
        fetchDeviceInfo();
        fetchOrderList();
    }
}, { immediate: true });

// 监听 activeDevice 变化（处理点击导航栏的情况）
watch(
    () => sidebarStore.activeDevice?.id,
    (newId, oldId) => {
        console.log('activeDevice.id 变化:', oldId, '->', newId);
        if (newId && newId !== oldId) {
            // 找到对应的设备获取 deviceCode
            const device = sidebarStore.deviceList.find(d => d.id === newId);
            console.log('找到设备:', device);
            if (device?.deviceCode) {
                fetchDeviceInfo();
                fetchOrderList();
            }
        }
    }
);

// 查询参数
const query = reactive({
    orderNo: '',
    status: '',
    dateRange: [] as string[],  // 日期范围，格式 YYYY-MM-DD
    styleType: '',
    payMethod: '',
    pageNum: 1,
    pageSize: 10
});

// 表格数据
const tableData = ref<OrderDisplayItem[]>([]);
const pageTotal = ref(0);
const loading = ref(false);

// 支付方式映射：00-支付宝，01-微信
const payCodeMap: Record<string, string> = {
    '00': '支付宝',
    '01': '微信'
};

// 订单类型映射：00-正常（已完成），01-退款
const orderTypeMap: Record<string, string> = {
    '00': 'completed',
    '01': 'refunded'
};

// 反向映射：UI选择 → API参数
const payCodeReverseMap: Record<string, string> = {
    'alipay': '00',
    'wechat': '01'
};

const orderTypeReverseMap: Record<string, string> = {
    'completed': '00',
    'refunded': '01'
};

// 将API数据转换为表格展示数据
const transformOrderData = (item: OrderSearchItem): OrderDisplayItem => {
    return {
        orderNo: item.orderNo,                              // 订单编号
        deviceName: item.deviceCode,                        // 设备名称（使用deviceCode）
        styleType: item.orderName || '',                    // 风格类型
        amount: item.zje,                                   // 单价
        status: orderTypeMap[item.orderType] || 'pending',  // 订单状态
        payMethod: payCodeMap[item.payCode] || item.payCode, // 支付方式
        createTime: item.createOn || '',                    // 下单时间（来自createOn）
        commission: item.yj,                                // 佣金
        commissionRate: item.bl                             // 佣金比例
    };
};

// 获取订单列表
const fetchOrderList = async () => {
    loading.value = true;
    try {
        // 构建查询参数
        const params: any = {
            dealerName: 'tinghua',  // 供应商名称（注意大小写）
            pageNum: query.pageNum,
            pageSize: query.pageSize
        };
        
        // 添加设备编码筛选（从当前选中的设备获取）
        if (currentDeviceCode.value) {
            params.deviceCode = currentDeviceCode.value;
        }
        
        // 添加可选筛选条件
        if (query.orderNo) {
            params.orderNo = query.orderNo;
        }
        if (query.payMethod) {
            // 转换支付方式：alipay->00, wechat->01
            params.payCode = payCodeReverseMap[query.payMethod];
        }
        if (query.status) {
            // 转换订单状态：completed->00, refunded->01
            params.orderType = orderTypeReverseMap[query.status];
        }
        if (query.styleType) {
            // 风格类型直接传递中文名称
            const styleTypeMap: Record<string, string> = {
                'cute': '萌化贴纸'
            };
            params.orderName = styleTypeMap[query.styleType] || query.styleType;
        }
        
        // 添加日期范围筛选
        if (query.dateRange && query.dateRange.length === 2) {
            // 格式化为 YYYY-MM-DD HH:mm:ss
            params.startDate = query.dateRange[0] + ' 00:00:00';
            params.endDate = query.dateRange[1] + ' 23:59:59';
        }
        
        console.log('订单查询参数:', params);
        const res = await searchOrders(params);
        console.log('订单查询响应:', res);
        
        if (res.code === 200 && res.data) {
            // 转换数据格式
            tableData.value = res.data.list.map(transformOrderData);
            pageTotal.value = res.data.total;
        } else {
            ElMessage.error(res.msg || '获取订单列表失败');
        }
    } catch (error) {
        console.error('获取订单列表失败:', error);
        ElMessage.error('获取订单列表失败');
    } finally {
        loading.value = false;
    }
};

// 获取状态文本
const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
        'pending': '待处理',
        'completed': '已完成',
        'refunded': '退款成功'
    };
    return texts[status] || status;
};

// 搜索
const handleSearch = () => {
    query.pageNum = 1;  // 重置到第一页
    fetchOrderList();
};

// 重置
const handleReset = () => {
    query.orderNo = '';
    query.status = '';
    query.dateRange = [];
    query.styleType = '';
    query.payMethod = '';
    query.pageNum = 1;
    fetchOrderList();
};

// 复制订单号
const handleCopy = (orderNo: string) => {
    navigator.clipboard.writeText(orderNo);
    ElMessage.success('订单号已复制');
};

// 分页
const handlePageChange = (val: number) => {
    query.pageNum = val;
    fetchOrderList();
};

const handleSizeChange = (val: number) => {
    query.pageSize = val;
    query.pageNum = 1;
    fetchOrderList();
};

// 页面加载时获取数据
onMounted(async () => {
    console.log('supplier-order mounted');
    console.log('当前设备编码:', currentDeviceCode.value);
    console.log('activeDevice:', sidebarStore.activeDevice);
    console.log('deviceList:', sidebarStore.deviceList);
    
    // 如果设备列表为空，等待数据加载
    if (sidebarStore.deviceList.length === 0) {
        // 等待 sidebar 数据加载完成
        const unwatch = watch(() => sidebarStore.deviceList, (list) => {
            if (list.length > 0) {
                console.log('设备列表已加载:', list);
                unwatch();
                if (currentDeviceCode.value) {
                    fetchDeviceInfo();
                    fetchOrderList();
                }
            }
        }, { immediate: true });
    } else if (currentDeviceCode.value) {
        fetchDeviceInfo();
        fetchOrderList();
    }
});

// 组件被激活时重新获取数据（处理keep-alive缓存场景）
onActivated(() => {
    console.log('supplier-order activated');
    console.log('当前设备编码:', currentDeviceCode.value);
    if (currentDeviceCode.value) {
        fetchDeviceInfo();
        fetchOrderList();
    }
});

// 防止未使用警告
const _icons = { Download, DocumentCopy, Location, Monitor, Setting };
</script>

<style scoped>
.container {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: 100%;
}

/* 设备信息卡片 */
.device-info-card {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 4px;
    padding: 16px 24px;
    margin-bottom: 16px;
}

.device-main {
    min-width: 180px;
    padding-right: 32px;
    border-right: 1px solid #e8e8e8;
}

.device-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
}

.device-code {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.status-tag {
    font-size: 12px;
}

.device-id {
    font-size: 13px;
    color: #999;
}

.device-detail {
    display: flex;
    align-items: flex-start;
    padding: 0 32px;
    border-right: 1px solid #e8e8e8;
}

.device-detail:last-child {
    border-right: none;
}

.device-detail .el-icon {
    font-size: 22px;
    color: #e6a23c;
    margin-right: 10px;
    margin-top: 2px;
}

.detail-content {
    display: flex;
    flex-direction: column;
}

.detail-label {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
}

.detail-value {
    font-size: 14px;
    color: #333;
}

/* 订单管理区域 */
.order-section {
    background: #fff;
    border-radius: 4px;
    padding: 16px 20px;
}

.page-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
}

.header-icon {
    color: #e6a23c;
    font-weight: bold;
    font-size: 16px;
    margin-right: 6px;
}

.header-title {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    flex: 1;
}

.export-icon {
    font-size: 18px;
    color: #666;
    cursor: pointer;
}

.export-icon:hover {
    color: #e6a23c;
}

.filter-box {
    margin-bottom: 16px;
}

.filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 12px;
}

.filter-item {
    display: flex;
    align-items: center;
}

.filter-label {
    font-size: 13px;
    color: #666;
    margin-right: 8px;
    white-space: nowrap;
}

.filter-actions {
    margin-top: 8px;
}

.filter-actions .el-button {
    min-width: 56px;
    font-size: 13px;
}

.table {
    width: 100%;
    font-size: 13px;
}

:deep(.table-header) {
    background-color: #fafafa !important;
    color: #666;
    font-weight: 500;
    font-size: 13px;
}

:deep(.el-table__row) {
    height: 48px;
}

.device-indicator {
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: #e6a23c;
    margin-right: 6px;
    vertical-align: middle;
}

.copy-icon {
    margin-left: 6px;
    cursor: pointer;
    color: #999;
    font-size: 14px;
    vertical-align: middle;
}

.copy-icon:hover {
    color: #409eff;
}

.status-text {
    font-size: 13px;
}

.status-text.completed {
    color: #67c23a;
}

.status-text.refunded {
    color: #409eff;
}

.status-text.pending {
    color: #e6a23c;
}

.pagination {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.total-text {
    font-size: 13px;
    color: #666;
    margin-right: 8px;
}

.page-suffix {
    font-size: 13px;
    color: #666;
    margin-left: 4px;
}

:deep(.el-pagination) {
    font-size: 13px;
}

:deep(.el-pagination .el-pagination__sizes) {
    margin-left: 8px;
}

:deep(.el-input__inner) {
    font-size: 13px;
}

:deep(.el-select .el-input__inner) {
    font-size: 13px;
}
</style>

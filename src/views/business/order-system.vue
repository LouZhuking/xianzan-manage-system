<template>
    <div class="container" :class="{ 'supplier-container': isSupplier }">
        <!-- 供应商视图：顶部设备信息卡片 -->
        <div v-if="isSupplier" class="device-info-card" v-loading="deviceInfoLoading">
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
        <div :class="isSupplier ? 'order-section' : ''">
            <!-- 页面标题 -->
            <div class="page-header">
                <span class="header-icon">|</span>
                <span class="header-title">订单管理</span>
                <el-icon v-if="isSupplier" class="export-icon"><Download /></el-icon>
                <el-button v-else class="export-btn" :icon="Download" circle />
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
                            value-format="YYYY/MM/DD"
                            :style="{ width: isSupplier ? '220px' : '240px' }"
                        />
                    </div>
                    <div class="filter-item">
                        <span class="filter-label">订单编号</span>
                        <el-input 
                            v-model="query.orderNo" 
                            placeholder="请输入"
                            clearable
                            :style="{ width: isSupplier ? '160px' : '200px' }"
                        />
                    </div>
                    <div class="filter-item">
                        <span class="filter-label">订单状态</span>
                        <el-select v-model="query.status" placeholder="请选择" clearable :style="{ width: isSupplier ? '120px' : '150px' }">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="已完成" value="completed"></el-option>
                            <el-option label="退款成功" value="refunded"></el-option>
                        </el-select>
                    </div>
                    <div class="filter-item">
                        <span class="filter-label">风格类型</span>
                        <el-select v-model="query.styleType" placeholder="请选择" clearable :style="{ width: isSupplier ? '120px' : '150px' }">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="萌化贴纸" value="cute"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="filter-row">
                    <div class="filter-item">
                        <span class="filter-label">支付方式</span>
                        <el-select v-model="query.payMethod" placeholder="请选择" clearable :style="{ width: isSupplier ? '120px' : '150px' }">
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
                <el-table-column prop="deviceName" label="设备名称" align="center" :min-width="isSupplier ? 120 : undefined">
                    <template #default="scope">
                        <span class="device-indicator"></span>
                        <span>{{ scope.row.deviceName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="orderNo" label="订单编号" align="center" :min-width="isSupplier ? 200 : undefined">
                    <template #default="scope">
                        <span>{{ scope.row.orderNo }}</span>
                        <el-icon class="copy-icon" @click="handleCopy(scope.row.orderNo)"><DocumentCopy /></el-icon>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="下单时间" align="center" :min-width="isSupplier ? 160 : undefined"></el-table-column>
                <el-table-column prop="styleType" label="风格类型" align="center" :min-width="isSupplier ? 100 : undefined">
                    <template #default="scope">
                        <span>{{ scope.row.styleType || '-' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="amount" label="单价" align="center" :min-width="isSupplier ? 100 : undefined">
                    <template #default="scope">
                        <span v-if="scope.row.amount">¥{{ scope.row.amount.toFixed(2) }}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="payMethod" label="支付方式" align="center" :min-width="isSupplier ? 100 : undefined"></el-table-column>
                <el-table-column prop="status" label="订单状态" align="center" :min-width="isSupplier ? 100 : undefined">
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
                    layout="prev, pager, next, jumper"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                />
                <span class="page-suffix">页</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="order-system">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Download, DocumentCopy, Location, Monitor, Setting } from '@element-plus/icons-vue';
import { usePermissStore } from '@/store/permiss';
import { useSidebarStore } from '@/store/sidebar';
import { searchOrders, getDeviceInfo, type OrderSearchParams, type DeviceInfoData } from '@/api/index';
import { transformOrderData, mapStatusToOrderType, mapPayMethodToPayCode, mapStyleTypeToOrderName, type OrderItem } from '@/utils/order-transform';

// 设备信息展示数据接口
interface DeviceDisplayInfo {
    deviceCode: string;
    deviceName: string;
    deviceStatus: string;
    deviceAddress: string;
    softwareVersion: string;
    hardwareVersion: string;
}

// 权限store
const permissStore = usePermissStore();
// 侧边栏store
const sidebarStore = useSidebarStore();
// 是否为供应商
const isSupplier = computed(() => permissStore.isSupplier);

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
const getStatusTagType = (status: string): string => {
    if (status === '运行中') return 'success';
    if (status === '离线中') return 'info';
    return 'warning';
};

// 从 sidebar store 获取当前设备编码（供应商视图）
const currentDeviceCode = computed(() => {
    if (!isSupplier.value) return '';
    
    // 优先从 activeDevice 获取设备信息
    if (sidebarStore.activeDevice) {
        const deviceList = sidebarStore.deviceList;
        const activeDeviceId = sidebarStore.activeDevice.id;
        const device = deviceList.find(d => d.id === activeDeviceId);
        if (device?.deviceCode) {
            return device.deviceCode;
        }
    }
    // 如果没有选中设备，返回设备列表第一个设备的编码
    if (sidebarStore.deviceList.length > 0) {
        return sidebarStore.deviceList[0].deviceCode;
    }
    return '';
});

// 获取设备信息
const fetchDeviceInfo = async () => {
    if (!currentDeviceCode.value || !isSupplier.value) return;
    
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

/**
 * 获取当前选中的供应商名称
 * - 管理员选择"供应商总览"时返回空字符串
 * - 管理员选择特定供应商时返回供应商名称
 * - 供应商角色时返回当前供应商名称
 */
const getCurrentDealerName = computed((): string => {
    if (permissStore.isAdmin) {
        // 供应商总览（index === 0）返回空字符串，查询所有
        if (!sidebarStore.activeSupplier || sidebarStore.activeSupplier.index === 0) {
            return '';
        }
        // 特定供应商：优先使用 activeSupplier.name，其次使用 currentSupplierInfo.name
        return sidebarStore.activeSupplier.name || sidebarStore.currentSupplierInfo?.name || '';
    }
    // 供应商视图：返回当前供应商名称
    return sidebarStore.currentSupplierInfo?.name || '';
});

// 查询参数
const query = reactive({
    orderNo: '',
    status: '',
    dateRange: [] as string[],
    styleType: '',
    payMethod: '',
    pageIndex: 1,
    pageSize: 10
});

// 表格数据（初始为空，由 API 获取）
const tableData = ref<OrderItem[]>([]);

const pageTotal = ref(0);
const loading = ref(false);

/**
 * 获取订单数据
 * 根据当前供应商选择和筛选条件查询订单
 * 供应商视图下会根据当前选中的设备进行筛选
 */
const fetchOrders = async () => {
    loading.value = true;
    try {
        // 构建请求参数
        const params: OrderSearchParams = {
            dealerName: getCurrentDealerName.value,
            pageNum: query.pageIndex,
            pageSize: query.pageSize
        };

        // 供应商视图下添加设备编码筛选
        if (isSupplier.value && currentDeviceCode.value) {
            params.deviceCode = currentDeviceCode.value;
        }

        // 添加筛选条件
        if (query.orderNo) {
            params.orderNo = query.orderNo;
        }
        if (query.status) {
            const orderType = mapStatusToOrderType(query.status);
            if (orderType) {
                params.orderType = orderType;
            }
        }
        if (query.payMethod) {
            const payCode = mapPayMethodToPayCode(query.payMethod);
            if (payCode) {
                params.payCode = payCode;
            }
        }
        if (query.styleType) {
            const orderName = mapStyleTypeToOrderName(query.styleType);
            if (orderName) {
                params.orderName = orderName;
            }
        }
        if (query.dateRange && query.dateRange.length === 2) {
            params.startDate = query.dateRange[0];
            params.endDate = query.dateRange[1];
        }

        console.log('订单查询参数:', params);

        const response = await searchOrders(params);
        console.log('订单查询响应:', response);
        
        if (response.code === 200 && response.data) {
            // 确保 list 存在且为数组
            const list = response.data.list || [];
            tableData.value = transformOrderData(list);
            pageTotal.value = response.data.total || 0;
            console.log('订单数据:', tableData.value, '总数:', pageTotal.value);
        } else {
            // 清空表格数据
            tableData.value = [];
            pageTotal.value = 0;
            if (response.msg) {
                ElMessage.error(response.msg);
            }
        }
    } catch (error) {
        console.error('获取订单数据失败:', error);
        // 清空表格数据
        tableData.value = [];
        pageTotal.value = 0;
        ElMessage.error('网络错误，请稍后重试');
    } finally {
        loading.value = false;
    }
};

// 监听供应商选择变化，自动刷新订单数据
watch(
    () => [sidebarStore.activeSupplier, sidebarStore.currentSupplierInfo],
    () => {
        console.log('供应商选择变化，当前dealerName:', getCurrentDealerName.value);
        // 重置页码
        query.pageIndex = 1;
        fetchOrders();
    },
    { deep: true }
);

// 监听设备编码变化（供应商视图），重新获取设备信息和订单数据
watch(currentDeviceCode, (newCode, oldCode) => {
    console.log('currentDeviceCode 变化:', oldCode, '->', newCode);
    if (newCode && isSupplier.value) {
        fetchDeviceInfo();
        // 重置页码并刷新订单数据
        query.pageIndex = 1;
        fetchOrders();
    }
});

// 监听 activeDevice 变化（处理点击导航栏的情况）
watch(
    () => sidebarStore.activeDevice?.id,
    (newId, oldId) => {
        console.log('activeDevice.id 变化:', oldId, '->', newId);
        if (newId && newId !== oldId && isSupplier.value) {
            fetchDeviceInfo();
            // 重置页码并刷新订单数据
            query.pageIndex = 1;
            fetchOrders();
        }
    }
);

// 页面初始化时获取订单数据
onMounted(() => {
    fetchOrders();
    // 供应商视图时获取设备信息
    if (isSupplier.value) {
        if (sidebarStore.deviceList.length === 0) {
            // 等待 sidebar 数据加载完成
            const unwatch = watch(() => sidebarStore.deviceList, (list) => {
                if (list.length > 0) {
                    console.log('设备列表已加载:', list);
                    unwatch();
                    if (currentDeviceCode.value) {
                        fetchDeviceInfo();
                    }
                }
            }, { immediate: true });
        } else if (currentDeviceCode.value) {
            fetchDeviceInfo();
        }
    }
});

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
    // 重置页码为1
    query.pageIndex = 1;
    fetchOrders();
};

// 重置
const handleReset = () => {
    query.orderNo = '';
    query.status = '';
    query.dateRange = [];
    query.styleType = '';
    query.payMethod = '';
    // 重置页码为1
    query.pageIndex = 1;
    fetchOrders();
};

// 复制订单号
const handleCopy = (orderNo: string) => {
    navigator.clipboard.writeText(orderNo);
    ElMessage.success('订单号已复制');
};

// 分页
const handlePageChange = (val: number) => {
    query.pageIndex = val;
    fetchOrders();
};

const handleSizeChange = (val: number) => {
    query.pageSize = val;
    query.pageIndex = 1;  // 切换每页数量时重置页码
    fetchOrders();
};

// 防止未使用警告
const _icons = { Download, DocumentCopy, Location, Monitor, Setting };
</script>

<style scoped>
/* 管理员视图样式 */
.container {
    padding: 20px;
    background-color: #fff;
    min-height: 100%;
}

/* 供应商视图样式 */
.container.supplier-container {
    background-color: #f5f5f5;
}

/* 设备信息卡片 - 仅供应商可见 */
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

/* 订单管理区域 - 供应商视图 */
.order-section {
    background: #fff;
    border-radius: 4px;
    padding: 16px 20px;
}

.page-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.header-icon {
    color: #e6a23c;
    font-weight: bold;
    font-size: 18px;
    margin-right: 8px;
}

.header-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    flex: 1;
}

.export-btn {
    border: none;
    background: transparent;
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
    margin-bottom: 20px;
}

.filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 15px;
}

.filter-item {
    display: flex;
    align-items: center;
}

.filter-label {
    font-size: 14px;
    color: #666;
    margin-right: 10px;
    white-space: nowrap;
}

.filter-actions {
    margin-top: 10px;
}

.filter-actions .el-button {
    min-width: 60px;
}

.table {
    width: 100%;
    font-size: 14px;
}

:deep(.table-header) {
    background-color: #fafafa !important;
    color: #666;
    font-weight: 500;
}

.device-indicator {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #e6a23c;
    margin-right: 8px;
}

.copy-icon {
    margin-left: 8px;
    cursor: pointer;
    color: #999;
}

.copy-icon:hover {
    color: #409eff;
}

.status-text {
    font-size: 14px;
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
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.total-text {
    font-size: 14px;
    color: #666;
    margin-right: 10px;
}

.page-suffix {
    font-size: 14px;
    color: #666;
    margin-left: 5px;
}

/* 供应商视图特定样式覆盖 */
.supplier-container .page-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
}

.supplier-container .header-icon {
    font-size: 16px;
    margin-right: 6px;
}

.supplier-container .header-title {
    font-size: 15px;
}

.supplier-container .filter-box {
    margin-bottom: 16px;
}

.supplier-container .filter-row {
    gap: 16px;
    margin-bottom: 12px;
}

.supplier-container .filter-label {
    font-size: 13px;
    margin-right: 8px;
}

.supplier-container .filter-actions {
    margin-top: 8px;
}

.supplier-container .filter-actions .el-button {
    min-width: 56px;
    font-size: 13px;
}

.supplier-container .table {
    font-size: 13px;
}

.supplier-container :deep(.table-header) {
    font-size: 13px;
}

.supplier-container .device-indicator {
    width: 6px;
    height: 6px;
    margin-right: 6px;
}

.supplier-container .copy-icon {
    margin-left: 6px;
    font-size: 14px;
}

.supplier-container .status-text {
    font-size: 13px;
}

.supplier-container .pagination {
    margin-top: 16px;
}

.supplier-container .total-text,
.supplier-container .page-suffix {
    font-size: 13px;
}
</style>

<template>
    <div class="container">
        <!-- 顶部设备信息卡片 -->
        <div class="device-info-card">
            <div class="device-main">
                <div class="device-header">
                    <span class="device-code">WOA00001</span>
                    <el-tag type="success" size="small" class="status-tag">运行中</el-tag>
                </div>
                <div class="device-id">ID: XXXX</div>
            </div>
            <div class="device-detail">
                <el-icon><Location /></el-icon>
                <div class="detail-content">
                    <div class="detail-label">设备地址</div>
                    <div class="detail-value">新天地广场3F</div>
                </div>
            </div>
            <div class="device-detail">
                <el-icon><Monitor /></el-icon>
                <div class="detail-content">
                    <div class="detail-label">软件版本</div>
                    <div class="detail-value">V-11.32.69</div>
                </div>
            </div>
            <div class="device-detail">
                <el-icon><Setting /></el-icon>
                <div class="detail-content">
                    <div class="detail-label">硬件版本</div>
                    <div class="detail-value">H-01.22.35b</div>
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
                            value-format="YYYY/MM/DD"
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
                    :current-page="query.pageIndex"
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
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Download, DocumentCopy, Location, Monitor, Setting } from '@element-plus/icons-vue';

// 定义订单数据接口
interface OrderItem {
    orderNo: string;
    deviceName: string;
    styleType: string;
    amount: number | null;
    status: string;
    payMethod: string;
    createTime: string;
}

// 查询参数
const query = reactive({
    orderNo: '',
    status: '',
    dateRange: ['2024/11/01', '2024/11/20'],
    styleType: '',
    payMethod: '',
    pageIndex: 1,
    pageSize: 10
});

// 表格数据
const tableData = ref<OrderItem[]>([
    {
        orderNo: '6932845754086986976',
        deviceName: '设备1',
        styleType: '萌化贴纸',
        amount: 36.00,
        status: 'completed',
        payMethod: '支付宝',
        createTime: '2024-08-03 08:13:07'
    },
    {
        orderNo: '6932845754086986976',
        deviceName: '设备1',
        styleType: '',
        amount: null,
        status: 'refunded',
        payMethod: '支付宝',
        createTime: '2024-08-03 08:13:07'
    },
    {
        orderNo: '6932845754086986976',
        deviceName: '设备1',
        styleType: '',
        amount: null,
        status: 'pending',
        payMethod: '微信',
        createTime: '2024-08-03 08:13:07'
    },
    {
        orderNo: '6932845754086986976',
        deviceName: '设备1',
        styleType: '萌化贴纸',
        amount: 36.00,
        status: 'completed',
        payMethod: '微信',
        createTime: '2024-08-03 08:13:07'
    },
    {
        orderNo: '6932845754086986976',
        deviceName: '设备1',
        styleType: '萌化贴纸',
        amount: 36.00,
        status: 'completed',
        payMethod: '微信',
        createTime: '2024-08-03 08:13:07'
    },
    {
        orderNo: '6932845754086986976',
        deviceName: '设备1',
        styleType: '萌化贴纸',
        amount: 36.00,
        status: 'completed',
        payMethod: '支付宝',
        createTime: '2024-08-03 08:13:07'
    },
    {
        orderNo: '6932845754086986976',
        deviceName: '设备1',
        styleType: '萌化贴纸',
        amount: 36.00,
        status: 'completed',
        payMethod: '支付宝',
        createTime: '2024-08-03 08:13:07'
    }
]);

const pageTotal = ref(100);
const loading = ref(false);

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
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
        ElMessage.success('查询成功');
    }, 500);
};

// 重置
const handleReset = () => {
    query.orderNo = '';
    query.status = '';
    query.dateRange = [];
    query.styleType = '';
    query.payMethod = '';
};

// 复制订单号
const handleCopy = (orderNo: string) => {
    navigator.clipboard.writeText(orderNo);
    ElMessage.success('订单号已复制');
};

// 分页
const handlePageChange = (val: number) => {
    query.pageIndex = val;
};

const handleSizeChange = (val: number) => {
    query.pageSize = val;
};

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

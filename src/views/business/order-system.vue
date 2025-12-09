<template>
    <div class="container">
        <div class="page-header">
            <h2>订单系统</h2>
            <p>管理和查看所有订单信息</p>
        </div>
        
        <!-- 状态统计 -->
        <el-row :gutter="20" class="statistics">
            <el-col :span="6">
                <el-card shadow="hover" class="stat-card pending">
                    <div class="stat-item">
                        <div class="stat-label">待处理</div>
                        <div class="stat-value">25</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="stat-card processing">
                    <div class="stat-item">
                        <div class="stat-label">处理中</div>
                        <div class="stat-value">58</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="stat-card completed">
                    <div class="stat-item">
                        <div class="stat-label">已完成</div>
                        <div class="stat-value">168</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="stat-card cancelled">
                    <div class="stat-item">
                        <div class="stat-label">已取消</div>
                        <div class="stat-value">12</div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 搜索和筛选区域 -->
        <div class="handle-box">
            <el-input 
                v-model="query.orderNo" 
                placeholder="订单号" 
                class="handle-input mr10"
                clearable
            ></el-input>
            <el-select v-model="query.status" placeholder="订单状态" class="mr10" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option label="待处理" value="pending"></el-option>
                <el-option label="处理中" value="processing"></el-option>
                <el-option label="已完成" value="completed"></el-option>
                <el-option label="已取消" value="cancelled"></el-option>
            </el-select>
            <el-date-picker
                v-model="query.date"
                type="date"
                placeholder="选择日期"
                class="mr10"
            />
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
        </div>

        <!-- 订单列表表格 -->
        <el-table 
            :data="tableData" 
            border 
            class="table" 
            header-cell-class-name="table-header"
            v-loading="loading"
        >
            <el-table-column prop="orderNo" label="订单号" width="180" align="center"></el-table-column>
            <el-table-column prop="userName" label="用户" align="center"></el-table-column>
            <el-table-column prop="deviceName" label="设备" align="center"></el-table-column>
            <el-table-column prop="serviceType" label="服务类型" align="center"></el-table-column>
            <el-table-column prop="amount" label="金额" align="center">
                <template #default="scope">
                    <span class="amount">¥{{ scope.row.amount }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template #default="scope">
                    <el-tag 
                        :type="getStatusType(scope.row.status)"
                    >
                        {{ getStatusText(scope.row.status) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" align="center"></el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template #default="scope">
                    <el-button text :icon="View" @click="handleView(scope.row)">详情</el-button>
                    <el-button 
                        v-if="scope.row.status === 'pending'" 
                        text 
                        type="primary" 
                        @click="handleProcess(scope.row)"
                    >
                        处理
                    </el-button>
                    <el-button 
                        v-if="scope.row.status === 'pending'" 
                        text 
                        type="danger" 
                        @click="handleCancel(scope.row)"
                    >
                        取消
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
            <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page="query.pageIndex"
                :page-size="query.pageSize"
                :total="pageTotal"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>
    </div>
</template>

<script setup lang="ts" name="order-system">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, View } from '@element-plus/icons-vue';

// 定义订单数据接口
interface OrderItem {
    orderNo: string;
    userName: string;
    deviceName: string;
    serviceType: string;
    amount: number;
    status: string;
    createTime: string;
}

// 查询参数
const query = reactive({
    orderNo: '',
    status: '',
    date: '',
    pageIndex: 1,
    pageSize: 10
});

// 表格数据
const tableData = ref<OrderItem[]>([
    {
        orderNo: 'ORD202412090001',
        userName: '张三',
        deviceName: '洗衣机001',
        serviceType: '标准洗涤',
        amount: 5,
        status: 'pending',
        createTime: '2024-12-09 10:00:00'
    },
    {
        orderNo: 'ORD202412090002',
        userName: '李四',
        deviceName: '洗衣机002',
        serviceType: '快速洗涤',
        amount: 8,
        status: 'processing',
        createTime: '2024-12-09 11:30:00'
    },
    {
        orderNo: 'ORD202412090003',
        userName: '王五',
        deviceName: '烘干机001',
        serviceType: '标准烘干',
        amount: 6,
        status: 'completed',
        createTime: '2024-12-09 09:20:00'
    },
    {
        orderNo: 'ORD202412090004',
        userName: '赵六',
        deviceName: '洗衣机003',
        serviceType: '深度清洁',
        amount: 15,
        status: 'cancelled',
        createTime: '2024-12-09 08:10:00'
    }
]);

const pageTotal = ref(4);
const loading = ref(false);

// 获取状态标签类型
const getStatusType = (status: string) => {
    const types: Record<string, string> = {
        'pending': 'warning',
        'processing': 'primary',
        'completed': 'success',
        'cancelled': 'info'
    };
    return types[status] || '';
};

// 获取状态文本
const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
        'pending': '待处理',
        'processing': '处理中',
        'completed': '已完成',
        'cancelled': '已取消'
    };
    return texts[status] || status;
};

// 搜索
const handleSearch = () => {
    ElMessage.success('搜索功能待实现');
};

// 刷新
const handleRefresh = () => {
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
        ElMessage.success('刷新成功');
    }, 500);
};

// 查看详情
const handleView = (row: OrderItem) => {
    ElMessage.info(`查看订单详情: ${row.orderNo}`);
};

// 处理订单
const handleProcess = (row: OrderItem) => {
    ElMessageBox.confirm('确定要处理该订单吗?', '提示', {
        type: 'warning'
    }).then(() => {
        ElMessage.success('订单已开始处理');
        row.status = 'processing';
    }).catch(() => {});
};

// 取消订单
const handleCancel = (row: OrderItem) => {
    ElMessageBox.confirm('确定要取消该订单吗?', '提示', {
        type: 'warning'
    }).then(() => {
        ElMessage.success('订单已取消');
        row.status = 'cancelled';
    }).catch(() => {});
};

// 分页
const handlePageChange = (val: number) => {
    query.pageIndex = val;
};
</script>

<style scoped>
.container {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
}

.page-header {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.page-header h2 {
    margin: 0 0 10px 0;
    font-size: 24px;
    color: #333;
}

.page-header p {
    margin: 0;
    color: #999;
    font-size: 14px;
}

.statistics {
    margin-bottom: 30px;
}

.stat-card {
    transition: all 0.3s;
}

.stat-card.pending {
    border-left: 3px solid #e6a23c;
}

.stat-card.processing {
    border-left: 3px solid #409eff;
}

.stat-card.completed {
    border-left: 3px solid #67c23a;
}

.stat-card.cancelled {
    border-left: 3px solid #909399;
}

.stat-item {
    text-align: center;
    padding: 10px 0;
}

.stat-label {
    font-size: 14px;
    color: #999;
    margin-bottom: 10px;
}

.stat-value {
    font-size: 28px;
    font-weight: bold;
    color: #333;
}

.handle-box {
    margin-bottom: 20px;
}

.handle-input {
    width: 200px;
}

.mr10 {
    margin-right: 10px;
}

.table {
    width: 100%;
    font-size: 14px;
}

.amount {
    color: #67c23a;
    font-weight: bold;
}

.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>

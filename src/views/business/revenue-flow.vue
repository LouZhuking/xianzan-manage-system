<template>
    <div class="container">
        <div class="page-header">
            <h2>营收流水</h2>
            <p>查看和管理所有营收流水记录</p>
        </div>
        
        <!-- 统计卡片 -->
        <el-row :gutter="20" class="statistics">
            <el-col :span="6">
                <el-card shadow="hover">
                    <div class="stat-item">
                        <div class="stat-label">今日营收</div>
                        <div class="stat-value">¥8,888</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div class="stat-item">
                        <div class="stat-label">本月营收</div>
                        <div class="stat-value">¥168,888</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div class="stat-item">
                        <div class="stat-label">今日订单</div>
                        <div class="stat-value">168</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div class="stat-item">
                        <div class="stat-label">本月订单</div>
                        <div class="stat-value">5,888</div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 搜索和筛选区域 -->
        <div class="handle-box">
            <el-date-picker
                v-model="query.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="mr10"
            />
            <el-select v-model="query.type" placeholder="交易类型" class="mr10" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option label="充值" value="recharge"></el-option>
                <el-option label="消费" value="consume"></el-option>
                <el-option label="退款" value="refund"></el-option>
            </el-select>
            <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
            <el-button :icon="Download" @click="handleExport">导出</el-button>
        </div>

        <!-- 流水列表表格 -->
        <el-table 
            :data="tableData" 
            border 
            class="table" 
            header-cell-class-name="table-header"
            v-loading="loading"
        >
            <el-table-column prop="id" label="流水号" width="180" align="center"></el-table-column>
            <el-table-column prop="orderNo" label="订单号" width="180" align="center"></el-table-column>
            <el-table-column prop="type" label="交易类型" align="center">
                <template #default="scope">
                    <el-tag :type="scope.row.type === '充值' ? 'success' : scope.row.type === '消费' ? 'primary' : 'warning'">
                        {{ scope.row.type }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" align="center">
                <template #default="scope">
                    <span :class="scope.row.type === '退款' ? 'red' : 'green'">
                        {{ scope.row.type === '退款' ? '-' : '+' }}¥{{ scope.row.amount }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="用户" align="center"></el-table-column>
            <el-table-column prop="deviceName" label="设备" align="center"></el-table-column>
            <el-table-column prop="createTime" label="交易时间" width="180" align="center"></el-table-column>
            <el-table-column label="操作" width="120" align="center">
                <template #default="scope">
                    <el-button text :icon="View" @click="handleView(scope.row)">详情</el-button>
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

<script setup lang="ts" name="revenue-flow">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Download, View } from '@element-plus/icons-vue';

// 定义流水数据接口
interface RevenueItem {
    id: string;
    orderNo: string;
    type: string;
    amount: number;
    userName: string;
    deviceName: string;
    createTime: string;
}

// 查询参数
const query = reactive({
    dateRange: [],
    type: '',
    pageIndex: 1,
    pageSize: 10
});

// 表格数据
const tableData = ref<RevenueItem[]>([
    {
        id: 'FL202412090001',
        orderNo: 'ORD202412090001',
        type: '充值',
        amount: 100,
        userName: '张三',
        deviceName: '洗衣机001',
        createTime: '2024-12-09 10:00:00'
    },
    {
        id: 'FL202412090002',
        orderNo: 'ORD202412090002',
        type: '消费',
        amount: 5,
        userName: '李四',
        deviceName: '洗衣机002',
        createTime: '2024-12-09 11:30:00'
    },
    {
        id: 'FL202412090003',
        orderNo: 'ORD202412090003',
        type: '退款',
        amount: 5,
        userName: '王五',
        deviceName: '烘干机001',
        createTime: '2024-12-09 14:20:00'
    }
]);

const pageTotal = ref(3);
const loading = ref(false);

// 搜索
const handleSearch = () => {
    ElMessage.success('查询功能待实现');
};

// 导出
const handleExport = () => {
    ElMessage.info('导出功能待实现');
};

// 查看详情
const handleView = (row: RevenueItem) => {
    ElMessage.info(`查看流水详情: ${row.id}`);
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

.mr10 {
    margin-right: 10px;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #f56c6c;
}

.green {
    color: #67c23a;
}

.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>

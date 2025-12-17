<template>
    <div class="device-manage-wrapper">
        <!-- 经销商视图：设备状态详情 -->
        <DeviceStatusDetail v-if="isSupplier" />
        
        <!-- 管理员视图：设备管理列表 -->
        <div v-else class="page-container">
        <!-- 左侧设备概况面板 -->
        <div class="overview-panel">
            <!-- 面板标题 -->
            <div class="panel-title">设备概况</div>
            
            <!-- 统计区域：环形图 + 右侧信息 -->
            <div class="statistics-section">
                <div class="chart-wrapper">
                    <div id="donut-chart" class="donut-chart"></div>
                </div>
                <div class="right-info">
                    <div class="total-info">
                        <div class="total-label">总设备量</div>
                        <div class="total-value">{{ overviewData.summary.totalDevices }}<span class="unit">个</span></div>
                    </div>
                    <!-- 图例 -->
                    <div class="chart-legend">
                        <div class="legend-item">
                            <span class="legend-block fault"></span>
                            <span class="legend-text">故障维护</span>
                            <span class="legend-count">{{ overviewData.summary.faultCount }}个</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-block normal"></span>
                            <span class="legend-text">运行正常</span>
                            <span class="legend-count">{{ overviewData.summary.normalCount }}个</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 故障警告卡片 -->
            <div class="status-card fault-card">
                <div class="card-header">
                    <span class="card-title">故障警告</span>
                    <div class="card-icon fault-icon">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff6b6b'%3E%3Cpath d='M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z'/%3E%3C/svg%3E" alt="warning" class="icon-img" />
                    </div>
                </div>
                <div class="status-grid fault-grid">
                    <div class="status-item" v-for="(item, index) in overviewData.faultWarning" :key="'fault-' + index">
                        <div class="status-count">{{ item.count }}</div>
                        <div class="status-label">{{ item.label }}</div>
                    </div>
                </div>
            </div>
            
            <!-- 更换维护卡片 -->
            <div class="status-card maintenance-card">
                <div class="card-header">
                    <span class="card-title">更换维护</span>
                    <div class="card-icon maintenance-icon">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23faad14'%3E%3Cpath d='M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z'/%3E%3C/svg%3E" alt="maintenance" class="icon-img" />
                    </div>
                </div>
                <div class="status-row">
                    <div class="status-item" v-for="(item, index) in overviewData.maintenance" :key="'maint-' + index">
                        <div class="status-count">{{ item.count }}</div>
                        <div class="status-label">{{ item.label }}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 右侧主内容区域 -->
        <div class="main-content">
            <!-- 设备状态标题 -->
            <div class="section-title">
                <span class="title-bar"></span>
                <span class="title-text">设备状态</span>
            </div>

            <!-- 状态类型筛选 -->
            <div class="filter-section">
                <span class="filter-label">状态类型 <el-icon class="info-icon"><QuestionFilled /></el-icon></span>
                <div class="filter-tags">
                    <el-tag 
                        v-for="tag in filterTags" 
                        :key="tag.key"
                        :class="['filter-tag', { active: activeFilter === tag.key }]"
                        @click="handleFilterChange(tag.key)"
                    >
                        {{ tag.label }}
                        <span v-if="tag.count > 0" class="tag-count">{{ tag.count }}</span>
                    </el-tag>
                </div>
            </div>

            <!-- 设备状态表格 -->
            <el-table 
                :data="deviceStatusData" 
                border 
                class="status-table" 
                header-cell-class-name="table-header"
                v-loading="loading"
                table-layout="fixed"
            >
                <el-table-column prop="supplier" label="供应商" align="center" :resizable="false">
                    <template #header>
                        <span>供应商</span>
                    </template>
                </el-table-column>
                <el-table-column prop="deviceName" label="设备名称" align="center" :resizable="false">
                    <template #header>
                        <span>设备名称</span>
                    </template>
                </el-table-column>
                <el-table-column prop="location" label="位置" align="center" :resizable="false"></el-table-column>
                <el-table-column label="设备状态" align="center" :resizable="false">
                    <template #header>
                        <span>设备状态</span>
                    </template>
                    <template #default="scope">
                        <span :class="['status-dot', scope.row.deviceStatus === '运行中' ? 'running' : 'offline']"></span>
                        <span :class="scope.row.deviceStatus === '运行中' ? 'status-running' : 'status-offline'">
                            {{ scope.row.deviceStatus }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="网络信号" align="center" :resizable="false">
                    <template #header>
                        <span>网络信号</span>
                    </template>
                    <template #default="scope">
                        <div :class="['signal-bars', { 'is-weak': scope.row.networkSignal <= 2 }]">
                            <span 
                                v-for="i in 4" 
                                :key="i" 
                                :class="['signal-bar', { active: i <= scope.row.networkSignal }]"
                                :style="{ height: (i * 4 + 4) + 'px' }"
                            ></span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="摄像头" align="center" :resizable="false">
                    <template #header>
                        <span>摄像头</span>
                    </template>
                    <template #default="scope">
                        <span :class="['fault-tag', { 'is-fault': scope.row.camera === 'fault' }]">
                            {{ scope.row.camera === 'fault' ? '故障' : '正常' }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="显示屏" align="center" :resizable="false">
                    <template #header>
                        <span>显示屏</span>
                    </template>
                    <template #default="scope">
                        <span :class="['fault-tag', { 'is-fault': scope.row.display === 'fault' }]">
                            {{ scope.row.display === 'fault' ? '故障' : '正常' }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="膜切机" align="center" :resizable="false">
                    <template #header>
                        <span>膜切机</span>
                    </template>
                    <template #default="scope">
                        <span :class="['fault-tag', { 'is-fault': scope.row.filmCutter === 'fault' }]">
                            {{ scope.row.filmCutter === 'fault' ? '故障' : '正常' }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="刀头" align="center" :resizable="false" width="140">
                    <template #header>
                        <span>刀头</span>
                    </template>
                    <template #default="scope">
                        <span class="usage-text">{{ scope.row.bladeUsage }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="打印机" align="center" :resizable="false" width="80">
                    <template #header>
                        <span>打印机</span>
                    </template>
                    <template #default="scope">
                        <span :class="['fault-tag', { 'is-fault': scope.row.printer === 'fault' }]">
                            {{ scope.row.printer === 'fault' ? '故障' : '正常' }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="色带" align="center" :resizable="false" width="70">
                    <template #header>
                        <span>色带</span>
                    </template>
                    <template #default="scope">
                        <div class="ribbon-status">
                            <div class="ribbon-icon" :class="{ 'is-fault': scope.row.ribbon === 'fault' }">
                                <span class="ribbon-bar" v-for="i in 3" :key="i"></span>
                            </div>
                            <span v-if="scope.row.ribbon === 'fault'" class="ribbon-badge">1</span>
                        </div>
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
    </div>
    </div>
</template>

<script setup lang="ts" name="device-manage">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { QuestionFilled } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import { usePermissStore } from '@/store/permiss';
import DeviceStatusDetail from './device-status-detail.vue';

// 权限store
const permissStore = usePermissStore();

// 判断是否为经销商
const isSupplier = computed(() => permissStore.isSupplier);

// 状态项接口
interface StatusItem {
    label: string;
    count: number;
}

// 筛选标签接口
interface FilterTag {
    key: string;
    label: string;
    count: number;
}

// 设备状态数据接口
interface DeviceStatusItem {
    supplier: string;
    deviceName: string;
    location: string;
    deviceStatus: string;
    networkSignal: number;
    camera: string;
    display: string;
    filmCutter: string;
    bladeUsage: string;
    printer: string;
    ribbon: string;
}

// 设备概况静态数据
const overviewData = reactive({
    summary: {
        totalDevices: 14,
        faultCount: 5,
        normalCount: 14
    },
    faultWarning: [
        { label: '摄像头', count: 2 },
        { label: '膜切机', count: 2 },
        { label: '摄像头', count: 2 },
        { label: '打印机', count: 2 },
        { label: '网络信号', count: 2 }
    ] as StatusItem[],
    maintenance: [
        { label: '刀头', count: 2 },
        { label: '纸张', count: 2 },
        { label: '色带', count: 2 }
    ] as StatusItem[]
});

// ECharts 实例
let chartInstance: echarts.ECharts | null = null;

// 初始化环形图
const initChart = () => {
    const chartDom = document.getElementById('donut-chart');
    if (!chartDom) return;
    
    chartInstance = echarts.init(chartDom);
    const option = {
        series: [{
            type: 'pie',
            radius: ['55%', '75%'],
            center: ['50%', '50%'],
            data: [
                { value: overviewData.summary.faultCount, name: '故障维护', itemStyle: { color: '#5DD3D3' } },
                { value: overviewData.summary.normalCount, name: '运行正常', itemStyle: { color: '#409EFF' } }
            ],
            label: { show: false },
            emphasis: { scale: false }
        }],
        graphic: [{
            type: 'text',
            left: 'center',
            top: '35%',
            style: {
                text: overviewData.summary.faultCount.toString(),
                fontSize: 32,
                fontWeight: 'bold',
                fill: '#333',
                textAlign: 'center',
            }
        }, {
            type: 'text',
            left: 'center',
            top: '55%',
            style: {
                text: '故障维护',
                fontSize: 12,
                fill: '#999',
                textAlign: 'center'
            }
        }]
    };
    chartInstance.setOption(option);
};

// 窗口resize处理
const handleResize = () => {
    chartInstance?.resize();
};

onMounted(() => {
    // 只有管理员视图才需要初始化图表
    if (!isSupplier.value) {
        nextTick(() => {
            initChart();
        });
    }
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
    }
});

// 监听角色变化，重新初始化图表
watch(isSupplier, (newVal) => {
    if (!newVal) {
        nextTick(() => {
            initChart();
        });
    } else {
        if (chartInstance) {
            chartInstance.dispose();
            chartInstance = null;
        }
    }
});

// 查询参数
const query = reactive({
    name: '',
    pageIndex: 1,
    pageSize: 10
});

// 当前激活的筛选标签
const activeFilter = ref('all');

// 筛选标签数据
const filterTags = ref<FilterTag[]>([
    { key: 'all', label: '全部', count: 0 },
    { key: 'deviceStatus', label: '设备状态', count: 2 },
    { key: 'networkSignal', label: '网络信号', count: 2 },
    { key: 'camera', label: '摄像头', count: 0 },
    { key: 'display', label: '显示屏', count: 0 },
    { key: 'filmCutter', label: '膜切机', count: 0 },
    { key: 'blade', label: '刀头', count: 2 },
    { key: 'printer', label: '打印机', count: 0 },
    { key: 'ribbon', label: '色带', count: 2 },
    { key: 'paper', label: '剩余纸张', count: 0 }
]);

// 设备状态表格数据
const deviceStatusData = ref<DeviceStatusItem[]>([
    {
        supplier: '供应商1号',
        deviceName: 'WOA00001',
        location: '新天地广场B1',
        deviceStatus: '离线中',
        networkSignal: 2,
        camera: 'fault',
        display: 'fault',
        filmCutter: 'fault',
        bladeUsage: '6000/8000(75%)',
        printer: 'normal',
        ribbon: 'fault'
    },
    {
        supplier: '供应商1号',
        deviceName: 'WOA00002',
        location: '新天地广场B1',
        deviceStatus: '运行中',
        networkSignal: 3,
        camera: 'fault',
        display: 'fault',
        filmCutter: 'fault',
        bladeUsage: '6000/8000(75%)',
        printer: 'normal',
        ribbon: 'fault'
    },
    {
        supplier: '供应商1号',
        deviceName: 'WOA00003',
        location: '新天地广场B1',
        deviceStatus: '运行中',
        networkSignal: 4,
        camera: 'normal',
        display: 'normal',
        filmCutter: 'normal',
        bladeUsage: '6000/8000(75%)',
        printer: 'normal',
        ribbon: 'normal'
    },
    {
        supplier: '供应商1号',
        deviceName: 'WOA00004',
        location: '新天地广场B1',
        deviceStatus: '运行中',
        networkSignal: 4,
        camera: 'normal',
        display: 'normal',
        filmCutter: 'normal',
        bladeUsage: '6000/8000(75%)',
        printer: 'normal',
        ribbon: 'normal'
    },
    {
        supplier: '供应商1号',
        deviceName: 'WOA00005',
        location: '新天地广场B1',
        deviceStatus: '运行中',
        networkSignal: 4,
        camera: 'normal',
        display: 'normal',
        filmCutter: 'normal',
        bladeUsage: '6000/8000(75%)',
        printer: 'normal',
        ribbon: 'normal'
    }
]);

const pageTotal = ref(5);
const loading = ref(false);

// 筛选切换
const handleFilterChange = (key: string) => {
    activeFilter.value = key;
};

// 分页
const handlePageChange = (val: number) => {
    query.pageIndex = val;
};
</script>

<style scoped>
.device-manage-wrapper {
    width: 100%;
    height: 100%;
}

.page-container {
    display: flex;
    gap: 15px;
    background-color: #f5f5f5;
    min-height: calc(100vh - 40px);
}

/* 左侧设备概况面板 */
.overview-panel {
    width: 300px;
    flex-shrink: 0;
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    height: 750px;
    border: 1px solid #f0f0f0;
}

.panel-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    padding-left: 12px;
    border-left: 3px solid #c28b09;
    margin-bottom: 24px;
    line-height: 1;
}

/* 统计区域 */
.statistics-section {
    display: flex;
    align-items: flex-start;
    margin-bottom: 24px;
}

.chart-wrapper {
    width: 160px;
    height: 160px;
    flex-shrink: 0;
}

.donut-chart {
    width: 100%;
    height: 100%;
}

.right-info {
    margin-left: 24px;
    flex: 1;
}

.total-info {
    margin-bottom: 20px;
}

.total-label {
    font-size: 14px;
    color: #999;
    margin-bottom: 8px;
}

.total-value {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    line-height: 1;
}

.total-value .unit {
    font-size: 14px;
    font-weight: 400;
    margin-left: 2px;
}

/* 图例 */
.chart-legend {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.legend-item {
    display: flex;
    align-items: center;
}

.legend-block {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    margin-right: 8px;
    flex-shrink: 0;
}

.legend-block.fault {
    background-color: #5DD3D3;
}

.legend-block.normal {
    background-color: #409EFF;
}

.legend-text {
    font-size: 14px;
    color: #666;
    margin-right: 8px;
}

.legend-count {
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

/* 状态卡片 */
.status-card {
    margin-bottom: 24px;
    padding: 20px;
    border-radius: 12px;
}

.fault-card {
    background: linear-gradient(180deg, #fff5f5 0%, #ffffff 60%);
}

.maintenance-card {
    background: linear-gradient(180deg, #fffbeb 0%, #ffffff 60%);
}

.status-card:last-child {
    margin-bottom: 0;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.card-title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.card-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.fault-icon {
    background-color: #FFF1F0;
}

.maintenance-icon {
    background-color: #fff7e6;
}

.icon-img {
    width: 22px;
    height: 22px;
}

/* 故障警告网格布局 - 第一行3个，第二行2个 */
.status-grid.fault-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px 12px;
}

/* 更换维护横向布局 */
.status-row {
    display: flex;
    justify-content: space-around;
}

.status-item {
    text-align: center;
    min-width: 50px;
}

.status-count {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    line-height: 1.2;
}

.status-label {
    font-size: 12px;
    color: #999;
    margin-top: 6px;
}

/* 右侧主内容区域 */
.main-content {
    flex: 1;
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    border: 1px solid #f0f0f0;
}

/* 设备状态标题 */
.section-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.title-bar {
    width: 3px;
    height: 16px;
    background-color: #c28b09;
    margin-right: 10px;
}

.title-text {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

/* 筛选区域 */
.filter-section {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
}

.filter-label {
    font-size: 14px;
    color: #666;
    margin-right: 15px;
    display: flex;
    align-items: center;
    white-space: nowrap;
}

.info-icon {
    margin-left: 4px;
    font-size: 14px;
    color: #999;
}

.filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.filter-tag {
    cursor: pointer;
    background-color: #f5f5f5;
    border: 1px solid #e0e0e0;
    color: #666;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 13px;
    transition: all 0.2s;
}

.filter-tag:hover {
    border-color: #c28b09;
    color: #c28b09;
}

.filter-tag.active {
    background-color: #fff7e6;
    border-color: #c28b09;
    color: #c28b09;
}

.tag-count {
    display: inline-block;
    background-color: #ff4d4f;
    color: #fff;
    font-size: 12px;
    padding: 0 6px;
    border-radius: 10px;
    margin-left: 6px;
    min-width: 18px;
    text-align: center;
    line-height: 18px;
}

/* 设备状态表格 */
.status-table {
    width: 100%;
    font-size: 13px;
}

.status-table :deep(.table-header) {
    background-color: #fafafa;
    color: #666;
    font-weight: 500;
}

/* 设备状态样式 */
.status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
}

.status-dot.running {
    background-color: #52c41a;
}

.status-dot.offline {
    background-color: #999;
}

.status-running {
    color: #52c41a;
}

.status-offline {
    color: #999;
}

/* 网络信号样式 */
.signal-bars {
    display: inline-flex;
    align-items: flex-end;
    gap: 2px;
    height: 20px;
}

.signal-bar {
    width: 4px;
    background-color: #e0e0e0;
    border-radius: 1px;
}

.signal-bar.active {
    background-color: #52c41a;
}

/* 信号弱时显示红色 */
.signal-bars.is-weak .signal-bar.active {
    background-color: #ff4d4f;
}

/* 状态标签样式 */
.fault-tag {
    display: inline-block;
    padding: 2px 12px;
    border-radius: 2px;
    font-size: 12px;
    border: 1px solid #52c41a;
    color: #52c41a;
    background-color: #fff;
}

.fault-tag.is-fault {
    border: 1px solid #ff4d4f;
    color: #ff4d4f;
    background-color: #fff;
}

/* 使用量文本 */
.usage-text {
    font-size: 13px;
    color: #333;
}

/* 排序图标 */
.sort-icon {
    font-size: 12px;
    color: #999;
    margin-left: 2px;
    vertical-align: middle;
}

/* 色带状态样式 */
.ribbon-status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.ribbon-icon {
    display: flex;
    gap: 2px;
    padding: 4px 6px;
    border: 1px solid #ddd;
    border-radius: 2px;
}

.ribbon-icon.is-fault {
    border-color: #ff4d4f;
}

.ribbon-bar {
    width: 3px;
    height: 14px;
    background-color: #333;
}

.ribbon-icon.is-fault .ribbon-bar {
    background-color: #ff4d4f;
}

.ribbon-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    min-width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    font-size: 10px;
    color: #fff;
    background-color: #ff4d4f;
    border-radius: 50%;
}

.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>
<template>
    <div class="device-status-detail">
        <!-- 设备状态头部卡片 -->
        <div class="device-header-card">
            <!-- 左侧设备信息 -->
            <div class="device-left-section">
                <div class="device-title-row">
                    <span class="device-id">{{ deviceInfo.deviceId }}</span>
                    <el-tag :type="deviceInfo.status === 'running' ? 'success' : 'info'" size="small" class="status-tag">
                        {{ deviceInfo.status === 'running' ? '运行中' : '离线中' }}
                    </el-tag>
                </div>
                <div class="signal-row">
                    <span class="signal-label">网络信号良好</span>
                    <div class="signal-bars">
                        <span v-for="i in 4" :key="i" :class="['signal-bar', { active: i <= deviceInfo.signalStrength }]"></span>
                    </div>
                </div>
                <div class="fault-summary">
                    <span class="fault-item">故障: <em>{{ deviceInfo.faultCount }}</em>个</span>
                    <span class="fault-item">维护: <em>{{ deviceInfo.maintenanceCount }}</em>个</span>
                </div>
            </div>

            <!-- 中间区域：设备组件状态 + 耗材状态 -->
            <div class="device-middle-section">
                <!-- 设备组件状态 - 上排 -->
                <div class="device-components">
                    <div class="component-item">
                        <div class="component-header">
                            <div class="component-icon camera">
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 15.2c1.8 0 3.2-1.4 3.2-3.2S13.8 8.8 12 8.8 8.8 10.2 8.8 12s1.4 3.2 3.2 3.2zm9-9.2h-3.2l-1.9-2H8.1L6.2 6H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-9 13c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z'/%3E%3C/svg%3E" alt="camera" />
                            </div>
                            <div class="component-name">摄像头</div>
                        </div>
                        <div :class="['component-status', componentStatus.camera.status]">{{ componentStatus.camera.text }}</div>
                    </div>
                    <div class="component-item">
                        <div class="component-header">
                            <div class="component-icon cutter">
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3h-3z'/%3E%3C/svg%3E" alt="cutter" />
                            </div>
                            <div class="component-name">膜切机</div>
                        </div>
                        <div :class="['component-status', componentStatus.cutter.status]">{{ componentStatus.cutter.text }}</div>
                    </div>
                    <div class="component-item">
                        <div class="component-header">
                            <div class="component-icon camera2">
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 15.2c1.8 0 3.2-1.4 3.2-3.2S13.8 8.8 12 8.8 8.8 10.2 8.8 12s1.4 3.2 3.2 3.2zm9-9.2h-3.2l-1.9-2H8.1L6.2 6H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-9 13c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z'/%3E%3C/svg%3E" alt="camera" />
                            </div>
                            <div class="component-name">摄像头</div>
                        </div>
                        <div :class="['component-status', componentStatus.camera2.status]">{{ componentStatus.camera2.text }}</div>
                    </div>
                    <div class="component-item">
                        <div class="component-header">
                            <div class="component-icon printer">
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z'/%3E%3C/svg%3E" alt="printer" />
                            </div>
                            <div class="component-name">打印机</div>
                        </div>
                        <div :class="['component-status', componentStatus.printer.status]">{{ componentStatus.printer.text }}</div>
                    </div>
                </div>

                <!-- 耗材状态 - 下排 -->
                <div class="consumables-section">
                    <div class="consumable-item">
                        <div class="consumable-header">
                            <span class="consumable-icon blade"></span>
                            <span class="consumable-name">刀头</span>
                            <el-tag v-if="consumables.blade.needReplace" type="info" size="small" class="need-replace-tag">需更换</el-tag>
                        </div>
                        <div class="consumable-value">{{ consumables.blade.current }}/{{ consumables.blade.total }}({{ consumables.blade.percent }}%)</div>
                        <div class="progress-bar">
                            <div class="progress-fill blade-fill" :style="{ width: consumables.blade.percent + '%' }"></div>
                        </div>
                    </div>
                    <div class="consumable-item">
                        <div class="consumable-header">
                            <span class="consumable-icon ribbon"></span>
                            <span class="consumable-name">色带</span>
                            <el-tag v-if="consumables.ribbon.needReplace" type="info" size="small" class="need-replace-tag">需更换</el-tag>
                        </div>
                        <div class="consumable-value">{{ consumables.ribbon.current }}/{{ consumables.ribbon.total }}({{ consumables.ribbon.percent }}%)</div>
                        <div class="progress-bar">
                            <div class="progress-fill ribbon-fill" :style="{ width: consumables.ribbon.percent + '%' }"></div>
                        </div>
                    </div>
                    <div class="consumable-item">
                        <div class="consumable-header">
                            <span class="consumable-icon paper"></span>
                            <span class="consumable-name">纸张</span>
                        </div>
                        <div class="consumable-value">{{ consumables.paper.current }}/{{ consumables.paper.total }}({{ consumables.paper.percent }}%)</div>
                        <div class="progress-bar">
                            <div class="progress-fill paper-fill" :style="{ width: consumables.paper.percent + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧设备详情信息 -->
            <div class="device-info-section">
                <div class="info-row">
                    <div class="info-item">
                        <span class="info-label">设备ID</span>
                        <span class="info-value">{{ deviceDetail.deviceId }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">设备名称</span>
                        <span class="info-value">{{ deviceDetail.deviceName }} <el-icon><Edit /></el-icon></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">软件版本</span>
                        <span class="info-value">{{ deviceDetail.softwareVersion }}</span>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-item">
                        <span class="info-label">设备地址</span>
                        <span class="info-value address">{{ deviceDetail.address }} <el-icon><Edit /></el-icon></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">硬件序列号</span>
                        <span class="info-value">{{ deviceDetail.hardwareSerial }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">硬件版本</span>
                        <span class="info-value">{{ deviceDetail.hardwareVersion }}</span>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-item">
                        <span class="info-label">蜂窝网络</span>
                        <span class="info-value">{{ deviceDetail.network }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">历史网络流量</span>
                        <span class="info-value">{{ deviceDetail.historyTraffic }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">当月网络流量</span>
                        <span class="info-value">{{ deviceDetail.monthTraffic }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部记录区域 -->
        <div class="records-section">
            <!-- 故障记录 -->
            <div class="record-card">
                <div class="record-header">
                    <span class="record-title">故障记录</span>
                </div>
                <div class="record-filter">
                    <span class="filter-label">故障类型 <el-icon class="info-icon"><QuestionFilled /></el-icon></span>
                    <div class="filter-tags">
                        <el-tag 
                            v-for="tag in faultFilterTags" 
                            :key="tag.key"
                            :class="['filter-tag', { active: activeFaultFilter === tag.key }]"
                            @click="activeFaultFilter = tag.key"
                        >
                            {{ tag.label }}
                        </el-tag>
                    </div>
                </div>
                <el-table :data="faultRecords" border class="record-table" header-cell-class-name="table-header">
                    <el-table-column prop="time" label="故障时间" align="center" width="150"></el-table-column>
                    <el-table-column prop="type" label="故障类型" align="center">
                        <template #default="scope">
                            <span class="fault-type">
                                <span class="fault-icon"></span>
                                {{ scope.row.type }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center" width="100">
                        <template #default="scope">
                            <span :class="['status-text', scope.row.status === '已修复' ? 'repaired' : 'pending']">
                                {{ scope.row.status }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="repairTime" label="修复时间" align="center" width="150">
                        <template #default="scope">
                            {{ scope.row.repairTime || '—' }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 维护记录 -->
            <div class="record-card">
                <div class="record-header">
                    <span class="record-title">维护记录</span>
                </div>
                <div class="record-filter">
                    <span class="filter-label">维护类型 <el-icon class="info-icon"><QuestionFilled /></el-icon></span>
                    <div class="filter-tags">
                        <el-tag 
                            v-for="tag in maintenanceFilterTags" 
                            :key="tag.key"
                            :class="['filter-tag', { active: activeMaintenanceFilter === tag.key }]"
                            @click="activeMaintenanceFilter = tag.key"
                        >
                            {{ tag.label }}
                        </el-tag>
                    </div>
                </div>
                <el-table :data="maintenanceRecords" border class="record-table" header-cell-class-name="table-header">
                    <el-table-column prop="time" label="时间" align="center" width="150"></el-table-column>
                    <el-table-column prop="type" label="维护类型" align="center">
                        <template #default="scope">
                            <span class="maintenance-type">
                                <span class="maintenance-icon"></span>
                                {{ scope.row.type }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="usage" label="使用状态" align="center" width="140"></el-table-column>
                    <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                    <el-table-column prop="result" label="处理结果" align="center" width="100">
                        <template #default="scope">
                            <span :class="['result-text', scope.row.result === '已处理' ? 'done' : 'pending']">
                                {{ scope.row.result }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { QuestionFilled, Edit } from '@element-plus/icons-vue';

defineOptions({
    name: 'device-status-detail'
});

// 设备基本信息
const deviceInfo = reactive({
    deviceId: 'WOA00001',
    status: 'running', // running | offline
    signalStrength: 4,
    faultCount: 2,
    maintenanceCount: 2
});

// 组件状态
const componentStatus = reactive({
    camera: { status: 'pending', text: '待处理故障' },
    cutter: { status: 'normal', text: '状态: 正常' },
    camera2: { status: 'pending', text: '待处理故障' },
    printer: { status: 'normal', text: '状态: 正常' }
});

// 耗材状态
const consumables = reactive({
    blade: { current: 6000, total: 8000, percent: 75, needReplace: true },
    ribbon: { current: 380, total: 400, percent: 95, needReplace: true },
    paper: { current: 100, total: 400, percent: 25, needReplace: false }
});

// 设备详情信息
const deviceDetail = reactive({
    deviceId: 'XXXXXX',
    deviceName: 'WOA00001',
    softwareVersion: 'V-11.32.69',
    address: 'XXXXXXXXXXXXXXXXXXXXXXXX',
    hardwareSerial: 'fgioaetqietjqfgioaetqietjqfj',
    hardwareVersion: 'H-01.22.35b',
    network: '中国联通',
    historyTraffic: '5352.218MB',
    monthTraffic: '253.342MB'
});

// 故障记录筛选标签
const faultFilterTags = ref([
    { key: 'all', label: '全部' },
    { key: 'network', label: '网络信号' },
    { key: 'camera', label: '摄像头' },
    { key: 'display', label: '显示屏' },
    { key: 'cutter', label: '膜切机' },
    { key: 'printer', label: '打印机' }
]);
const activeFaultFilter = ref('all');

// 维护记录筛选标签
const maintenanceFilterTags = ref([
    { key: 'all', label: '全部' },
    { key: 'blade', label: '刀头' },
    { key: 'ribbon', label: '色带' },
    { key: 'paper', label: '纸张' }
]);
const activeMaintenanceFilter = ref('all');

// 故障记录数据
const faultRecords = ref([
    { time: '2024-06-27 12:16', type: '网络信号', status: '未修复', repairTime: '' },
    { time: '2024-06-26 12:16', type: '摄像头', status: '已修复', repairTime: '2024-06-28 12:16' },
    { time: '2024-06-26 12:16', type: '显示屏', status: '已修复', repairTime: '2024-06-28 12:16' },
    { time: '2024-06-25 11:16', type: '膜切机', status: '已修复', repairTime: '2024-06-28 12:16' },
    { time: '2024-06-23 12:16', type: '网络信号', status: '已修复', repairTime: '2024-06-28 12:16' },
    { time: '2024-06-21 12:16', type: '网络信号', status: '未修复', repairTime: '' },
    { time: '2024-06-21 11:16', type: '膜切机', status: '已修复', repairTime: '2024-06-28 12:16' },
    { time: '2024-06-21 12:16', type: '网络信号', status: '已修复', repairTime: '2024-06-28 12:16' }
]);

// 维护记录数据
const maintenanceRecords = ref([
    { time: '2024-06-27 12:16', type: '刀头', usage: '6000/8000(75%)', remark: '使用接近设计寿命', result: '已处理' },
    { time: '2024-06-27 12:16', type: '色带', usage: '380/400(95%)', remark: '色带不足，请及时更换', result: '未处理' },
    { time: '2024-06-27 12:16', type: '纸张', usage: '380/400(95%)', remark: '纸张不足，请及时更换', result: '已处理' },
    { time: '2024-06-27 12:16', type: '色带', usage: '380/400(95%)', remark: '色带不足，请及时更换', result: '未处理' },
    { time: '2024-06-28 12:16', type: '纸张', usage: '380/400(95%)', remark: '纸张不足，请及时更换', result: '已处理' },
    { time: '2024-06-27 12:16', type: '纸张', usage: '380/400(95%)', remark: '纸张不足，请及时更换', result: '已处理' },
    { time: '2024-06-27 12:16', type: '色带', usage: '380/400(95%)', remark: '色带不足，请及时更换', result: '未处理' },
    { time: '2024-06-28 12:16', type: '纸张', usage: '380/400(95%)', remark: '纸张不足，请及时更换', result: '已处理' }
]);
</script>

<style scoped>
.device-status-detail {
    background-color: #f5f5f5;
    min-height: 780px;
}

/* 设备头部卡片 */
.device-header-card {
    display: flex;
    background: #fff;
    border-radius: 8px;
    padding: 20px 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    border: 1px solid #f0f0f0;
    gap: 24px;
    align-items: stretch;
}

/* 左侧设备信息 */
.device-left-section {
    min-width: 140px;
    padding-right: 24px;
    border-right: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.device-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}

.device-id {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.status-tag {
    border-radius: 4px;
}

.signal-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
}

.signal-label {
    font-size: 12px;
    color: #999;
}

.signal-bars {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 16px;
}

.signal-bar {
    width: 4px;
    background-color: #e0e0e0;
    border-radius: 1px;
}

.signal-bar:nth-child(1) { height: 6px; }
.signal-bar:nth-child(2) { height: 9px; }
.signal-bar:nth-child(3) { height: 12px; }
.signal-bar:nth-child(4) { height: 15px; }

.signal-bar.active {
    background-color: #52c41a;
}

.fault-summary {
    display: flex;
    gap: 16px;
}

.fault-item {
    font-size: 13px;
    color: #ff4d4f;
}

.fault-item:last-child {
    color: #52c41a;
}

.fault-item em {
    font-style: normal;
    font-weight: 600;
}

/* 中间区域 */
.device-middle-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 24px;
    border-right: 1px solid #f0f0f0;
    justify-content: center;
}

/* 设备组件状态 */
.device-components {
    display: flex;
    gap: 0;
}

.component-item {
    min-width: 100px;
    padding: 0 20px;
    border-right: 1px solid #f0f0f0;
}

.component-item:first-child {
    padding-left: 0;
}

.component-item:last-child {
    border-right: none;
    padding-right: 0;
}

.component-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
}

.component-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.component-icon img {
    width: 18px;
    height: 18px;
}

.component-name {
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

.component-status {
    font-size: 12px;
    color: #52c41a;
}

.component-status.pending {
    color: #ff4d4f;
}

.component-status.normal {
    color: #52c41a;
}

/* 耗材状态 */
.consumables-section {
    display: flex;
    gap: 12px;
}

.consumable-item {
    min-width: 140px;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.consumable-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
}

.consumable-icon {
    width: 16px;
    height: 16px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    flex-shrink: 0;
}

.consumable-icon.blade {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3h-3z'/%3E%3C/svg%3E");
}

.consumable-icon.ribbon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3C/svg%3E");
}

.consumable-icon.paper {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z'/%3E%3C/svg%3E");
}

.consumable-name {
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

.need-replace-tag {
    background-color: #e8f5e9 !important;
    border-color: #a5d6a7 !important;
    color: #43a047 !important;
    font-size: 12px;
    padding: 0 6px;
    height: 20px;
    line-height: 18px;
    border-radius: 4px;
}

.consumable-value {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: #e8e8e8;
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s;
    background: linear-gradient(90deg, #409EFF 0%, #5dade2 100%);
}

.progress-fill.blade-fill {
    background: linear-gradient(90deg, #409EFF 0%, #5dade2 100%);
}

.progress-fill.ribbon-fill {
    background: linear-gradient(90deg, #409EFF 0%, #85c1e9 100%);
}

.progress-fill.paper-fill {
    background: linear-gradient(90deg, #409EFF 0%, #5dade2 100%);
}

/* 右侧设备详情 */
.device-info-section {
    flex: 1;
    min-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
}

.info-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-label {
    font-size: 14px;
    color: #333;
    font-weight: 400;
}

.info-value {
    font-size: 14px;
    color: #333;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
}

.info-value.address {
    word-break: break-all;
}

.info-value .el-icon {
    color: #409EFF;
    cursor: pointer;
    font-size: 14px;
}

/* 记录区域 */
.records-section {
    display: flex;
    gap: 20px;
}

.record-card {
    flex: 1;
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    border: 1px solid #f0f0f0;
}

.record-header {
    margin-bottom: 16px;
}

.record-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    padding-left: 12px;
    border-left: 3px solid #c28b09;
}

.record-filter {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
}

.filter-label {
    font-size: 13px;
    color: #666;
    margin-right: 12px;
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
    gap: 8px;
}

.filter-tag {
    cursor: pointer;
    background-color: #f5f5f5;
    border: 1px solid #e0e0e0;
    color: #666;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
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

.record-table {
    width: 100%;
    font-size: 13px;
}

.record-table :deep(.table-header) {
    background-color: #fafafa;
    color: #666;
    font-weight: 500;
}

.fault-type, .maintenance-type {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.fault-icon, .maintenance-icon {
    width: 14px;
    height: 14px;
    background: #666;
    border-radius: 2px;
}

.status-text.repaired {
    color: #409EFF;
}

.status-text.pending {
    color: #ff4d4f;
}

.result-text.done {
    color: #409EFF;
}

.result-text.pending {
    color: #ff4d4f;
}
</style>

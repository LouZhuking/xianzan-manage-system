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
                            <el-tag v-if="consumables.blade.needReplace" type="danger" size="small" class="need-replace-tag">需更换</el-tag>
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
                            <el-tag v-if="consumables.ribbon.needReplace" type="danger" size="small" class="need-replace-tag">需更换</el-tag>
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
                            <el-tag v-if="consumables.paper.needReplace" type="danger" size="small" class="need-replace-tag">需更换</el-tag>
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
                <el-table :data="filteredFaultRecords" border class="record-table" header-cell-class-name="table-header" height="300">
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
                    <el-button type="primary" size="small" @click="showMaintenanceForm = true">
                        <el-icon><Plus /></el-icon>添加
                    </el-button>
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
                <el-table :data="filteredMaintenanceRecords" border class="record-table" header-cell-class-name="table-header" height="300">
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

        <!-- 添加维护记录弹窗 -->
        <el-dialog
            v-model="showMaintenanceForm"
            title="添加维护记录"
            width="500px"
            :close-on-click-modal="false"
        >
            <el-form
                ref="maintenanceFormRef"
                :model="maintenanceForm"
                :rules="maintenanceRules"
                label-width="100px"
            >
                <el-form-item label="设备ID" prop="deviceId">
                    <el-input v-model="maintenanceForm.deviceId" placeholder="请输入设备ID" disabled />
                </el-form-item>
                <el-form-item label="维护类型" prop="type">
                    <el-select v-model="maintenanceForm.type" placeholder="请选择维护类型" style="width: 100%">
                        <el-option label="刀头" value="刀头" />
                        <el-option label="色带" value="色带" />
                        <el-option label="纸张" value="纸张" />
                    </el-select>
                </el-form-item>
                <el-form-item label="使用状态" prop="status">
                    <el-select v-model="maintenanceForm.status" placeholder="请选择使用状态" style="width: 100%">
                        <el-option label="维护完成" value="维护完成" />
                        <el-option label="待维护" value="待维护" />
                        <el-option label="已处理" value="已处理" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input
                        v-model="maintenanceForm.remark"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入备注信息"
                    />
                </el-form-item>
                <el-form-item label="处理结果" prop="result">
                    <el-input v-model="maintenanceForm.result" disabled />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showMaintenanceForm = false">取消</el-button>
                <el-button type="primary" @click="submitMaintenanceForm">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { QuestionFilled, Edit, Plus } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useSidebarStore } from '@/store/sidebar';
import { getDeviceStatus, getFaultRecords, getMaintenanceRecords, createMaintenanceRecord, type FaultRecordItem, type MaintenanceRecordItem } from '@/api/index';

defineOptions({
    name: 'device-status-detail'
});

// ========== Store ==========
const sidebarStore = useSidebarStore();

// ========== 类型定义 ==========
interface PartItem {
    partId: number;
    partName: string;
    partNum: number;
    partTotal: number;
    partStatus: string;
}

interface ConsumableItem {
    current: number;
    total: number;
    percent: number;
    needReplace: boolean;
}

// ========== 数据解析工具函数 ==========

/**
 * 从 partList 中获取指定部件的数据
 * @param partList 部件列表
 * @param partName 部件名称
 * @returns 部件数据或 null
 */
const getPartData = (partList: PartItem[] | null | undefined, partName: string): PartItem | null => {
    if (!partList || partList.length === 0) {
        return null;
    }
    return partList.find(p => p.partName === partName) || null;
};

/**
 * 解析设备运行状态
 * @param networkSignal 网络信号值 0-4
 * @returns 'running' | 'offline'
 */
const parseRunningStatus = (networkSignal: number): 'running' | 'offline' => {
    return networkSignal >= 2 ? 'running' : 'offline';
};

/**
 * 解析组件状态文本
 * @param partStatus 部件状态 '正常' | '故障'
 * @returns { status: string, text: string }
 */
const parseComponentStatusText = (partStatus: string | null | undefined): { status: 'normal' | 'pending'; text: string } => {
    if (partStatus === '故障') {
        return { status: 'pending', text: '待处理故障' };
    }
    return { status: 'normal', text: '状态: 正常' };
};

/**
 * 计算耗材百分比和是否需要更换
 * @param current 当前值
 * @param total 总值
 * @returns ConsumableItem
 */
const calculateConsumable = (current: number, total: number): ConsumableItem => {
    const percent = total > 0 ? Math.round((current / total) * 100) : 0;
    return {
        current,
        total,
        percent,
        needReplace: percent < 10  // 低于10%时需要更换
    };
};

// ========== 响应式数据 ==========

// 加载状态
const loading = ref(false);

// 设备基本信息
const deviceInfo = reactive({
    deviceId: '-',
    status: 'offline' as 'running' | 'offline',
    signalStrength: 0,
    faultCount: 0,
    maintenanceCount: 0
});

// 组件状态
const componentStatus = reactive({
    camera: { status: 'normal' as 'normal' | 'pending', text: '状态: 正常' },
    cutter: { status: 'normal' as 'normal' | 'pending', text: '状态: 正常' },
    camera2: { status: 'normal' as 'normal' | 'pending', text: '状态: 正常' },
    printer: { status: 'normal' as 'normal' | 'pending', text: '状态: 正常' }
});

// 耗材状态
const consumables = reactive({
    blade: { current: 0, total: 0, percent: 0, needReplace: false } as ConsumableItem,
    ribbon: { current: 0, total: 0, percent: 0, needReplace: false } as ConsumableItem,
    paper: { current: 0, total: 0, percent: 0, needReplace: false } as ConsumableItem
});

// 设备详情信息
const deviceDetail = reactive({
    deviceId: '-',
    deviceName: '-',
    softwareVersion: '-',
    address: '-',
    hardwareSerial: '-',
    hardwareVersion: '-',
    network: '-',
    historyTraffic: '-',
    monthTraffic: '-'
});

// 故障记录数据（从API获取）- 提前声明以避免初始化顺序问题
const faultRecords = ref<Array<{
    time: string;
    type: string;
    status: string;
    repairTime: string;
}>>([]);

// 维护记录数据（从API获取）- 提前声明以避免初始化顺序问题
const maintenanceRecords = ref<Array<{
    time: string;
    type: string;
    usage: string;
    remark: string;
    result: string;
}>>([]);

// ========== 数据重置函数 ==========

/**
 * 将所有响应式数据重置为初始默认值
 */
const resetToDefaults = () => {
    // 重置设备基本信息
    deviceInfo.deviceId = '-';
    deviceInfo.status = 'offline';
    deviceInfo.signalStrength = 0;
    deviceInfo.faultCount = 0;
    deviceInfo.maintenanceCount = 0;

    // 重置组件状态
    const defaultComponentStatus = { status: 'normal' as const, text: '状态: 正常' };
    componentStatus.camera = { ...defaultComponentStatus };
    componentStatus.cutter = { ...defaultComponentStatus };
    componentStatus.camera2 = { ...defaultComponentStatus };
    componentStatus.printer = { ...defaultComponentStatus };

    // 重置耗材状态
    const defaultConsumable = { current: 0, total: 0, percent: 0, needReplace: false };
    consumables.blade = { ...defaultConsumable };
    consumables.ribbon = { ...defaultConsumable };
    consumables.paper = { ...defaultConsumable };

    // 重置设备详情
    deviceDetail.deviceId = '-';
    deviceDetail.deviceName = '-';
    deviceDetail.softwareVersion = '-';
    deviceDetail.address = '-';
    deviceDetail.hardwareSerial = '-';
    deviceDetail.hardwareVersion = '-';
    deviceDetail.network = '-';
    deviceDetail.historyTraffic = '-';
    deviceDetail.monthTraffic = '-';
    
    // 重置故障记录
    faultRecords.value = [];
    
    // 重置维护记录
    maintenanceRecords.value = [];
};

// ========== 数据获取函数 ==========

/**
 * 根据设备ID获取deviceCode
 * @param deviceId 设备ID
 * @returns deviceCode 或 null
 */
const getDeviceCode = (deviceId: string): string | null => {
    // 从 deviceList 中查找
    const device = sidebarStore.deviceList.find(d => d.id === deviceId);
    if (device) {
        return device.deviceCode;
    }
    // 从 supplierList 中查找
    for (const supplier of sidebarStore.supplierList) {
        const found = supplier.devices?.find(d => d.id === deviceId);
        if (found) {
            return found.deviceCode;
        }
    }
    return null;
};

/**
 * 获取设备数据
 * @param deviceCode 设备编码
 */
const fetchDeviceData = async (deviceCode: string) => {
    loading.value = true;
    try {
        const res = await getDeviceStatus(deviceCode);
        console.log('设备详情API响应:', res);

        if (res.code === 200 && res.data) {
            const data = res.data;
            const partList = data.partList || [];

            // 更新设备基本信息
            const networkPart = getPartData(partList, '网络信号');
            const signalStrength = networkPart?.partNum ?? 0;
            
            deviceInfo.deviceId = data.deviceName || deviceCode;
            deviceInfo.status = parseRunningStatus(signalStrength);
            deviceInfo.signalStrength = signalStrength;
            
            // 计算故障数量（状态为"故障"的部件数量）
            const faultCount = partList.filter(p => p.partStatus === '故障').length;
            deviceInfo.faultCount = faultCount;
            
            // 计算维护数量（耗材使用率>=75%的数量）
            let maintenanceCount = 0;
            const bladePart = getPartData(partList, '刀头');
            const ribbonPart = getPartData(partList, '色带');
            const paperPart = getPartData(partList, '剩余纸张');
            
            if (bladePart && bladePart.partTotal > 0 && (bladePart.partNum / bladePart.partTotal) >= 0.75) maintenanceCount++;
            if (ribbonPart && ribbonPart.partTotal > 0 && (ribbonPart.partNum / ribbonPart.partTotal) >= 0.75) maintenanceCount++;
            if (paperPart && paperPart.partTotal > 0 && (paperPart.partNum / paperPart.partTotal) >= 0.75) maintenanceCount++;
            deviceInfo.maintenanceCount = maintenanceCount;

            // 更新组件状态
            const cameraPart = getPartData(partList, '摄像头');
            const cutterPart = getPartData(partList, '膜切机');
            const printerPart = getPartData(partList, '打印机');
            const displayPart = getPartData(partList, '显示屏');

            componentStatus.camera = parseComponentStatusText(cameraPart?.partStatus);
            componentStatus.cutter = parseComponentStatusText(cutterPart?.partStatus);
            componentStatus.camera2 = parseComponentStatusText(displayPart?.partStatus); // 第二个摄像头位置显示显示屏状态
            componentStatus.printer = parseComponentStatusText(printerPart?.partStatus);

            // 更新耗材状态
            consumables.blade = calculateConsumable(bladePart?.partNum ?? 0, bladePart?.partTotal ?? 0);
            consumables.ribbon = calculateConsumable(ribbonPart?.partNum ?? 0, ribbonPart?.partTotal ?? 0);
            consumables.paper = calculateConsumable(paperPart?.partNum ?? 0, paperPart?.partTotal ?? 0);

            // 更新设备详情
            deviceDetail.deviceId = deviceCode;
            deviceDetail.deviceName = data.deviceName || '-';
            deviceDetail.softwareVersion = (data as any).softwareVersion || 'V-11.32.69';
            deviceDetail.address = (data as any).deviceAddress || '-';
            deviceDetail.hardwareSerial = (data as any).hardwareSerial || '-';
            deviceDetail.hardwareVersion = (data as any).hardwareVersion || 'H-01.22.35b';
            deviceDetail.network = (data as any).network || '中国联通';
            deviceDetail.historyTraffic = (data as any).historyTraffic || '-';
            deviceDetail.monthTraffic = (data as any).monthTraffic || '-';

            console.log('设备数据更新完成:', { deviceInfo, componentStatus, consumables, deviceDetail });
            
            // 获取故障记录
            fetchFaultRecords(deviceCode);
            
            // 获取维护记录
            fetchMaintenanceRecords(deviceCode);
        } else {
            console.error('获取设备数据失败:', res.msg);
            resetToDefaults();
        }
    } catch (error) {
        console.error('获取设备数据异常:', error);
        resetToDefaults();
    } finally {
        loading.value = false;
    }
};

// ========== 监听设备切换 ==========

watch(() => sidebarStore.activeDevice, (newDevice) => {
    console.log('activeDevice 变化:', newDevice);
    if (newDevice) {
        const deviceCode = getDeviceCode(newDevice.id);
        console.log('获取到 deviceCode:', deviceCode);
        if (deviceCode) {
            fetchDeviceData(deviceCode);
        } else {
            // 尝试直接使用 id 作为 deviceCode
            fetchDeviceData(newDevice.id);
        }
    } else {
        resetToDefaults();
    }
}, { immediate: true });

// ========== 生命周期 ==========

onMounted(() => {
    // 如果已有选中的设备，立即获取数据
    if (sidebarStore.activeDevice) {
        const deviceCode = getDeviceCode(sidebarStore.activeDevice.id);
        if (deviceCode) {
            fetchDeviceData(deviceCode);
        }
    }
});

// ========== 故障记录和维护记录 ==========

// 当前选中的故障类型筛选
const activeFaultFilter = ref('all');

// 动态生成故障类型筛选标签（根据API返回的故障记录中的partName去重）
const faultFilterTags = computed(() => {
    // 固定的"全部"标签
    const tags: Array<{ key: string; label: string }> = [{ key: 'all', label: '全部' }];
    
    // 从故障记录中提取唯一的故障类型
    const uniqueTypes = new Set<string>();
    faultRecords.value.forEach(record => {
        if (record.type && record.type !== '-') {
            uniqueTypes.add(record.type);
        }
    });
    
    // 将唯一类型转换为标签格式
    uniqueTypes.forEach(type => {
        tags.push({ key: type, label: type });
    });
    
    return tags;
});

// 根据筛选条件过滤后的故障记录
const filteredFaultRecords = computed(() => {
    if (activeFaultFilter.value === 'all') {
        return faultRecords.value;
    }
    // 直接使用选中的key作为类型进行筛选（因为key就是partName）
    return faultRecords.value.filter(record => record.type === activeFaultFilter.value);
});

// 维护记录筛选标签（动态生成，根据API返回的维护记录中的type去重）
const maintenanceFilterTags = computed(() => {
    // 固定的"全部"标签
    const tags: Array<{ key: string; label: string }> = [{ key: 'all', label: '全部' }];

    // 从维护记录中提取唯一的维护类型
    const uniqueTypes = new Set<string>();
    maintenanceRecords.value.forEach(record => {
        if (record.type && record.type !== '-') {
            uniqueTypes.add(record.type);
        }
    });

    // 将唯一类型转换为标签格式
    uniqueTypes.forEach(type => {
        tags.push({ key: type, label: type });
    });

    return tags;
});
const activeMaintenanceFilter = ref('all');

// 根据筛选条件过滤后的维护记录
const filteredMaintenanceRecords = computed(() => {
    if (activeMaintenanceFilter.value === 'all') {
        return maintenanceRecords.value;
    }
    // 直接使用选中的key作为类型进行筛选
    return maintenanceRecords.value.filter(record => record.type === activeMaintenanceFilter.value);
});

/**
 * 获取故障记录数据
 * @param deviceCode 设备编码
 */
const fetchFaultRecords = async (deviceCode: string) => {
    try {
        const res = await getFaultRecords(deviceCode);
        console.log('故障记录API响应:', res);
        
        if (res.code === 200 && res.data && res.data.list) {
            // 转换API数据格式为表格显示格式
            // downTime->故障时间，partName->故障类型，partStatus->状态，repairTime->修复时间
            faultRecords.value = res.data.list.map((item: FaultRecordItem) => ({
                time: item.downTime || '-',
                type: item.partName || '-',
                status: item.partStatus === '正常' ? '已修复' : '未修复',
                repairTime: item.repairTime || '-'
            }));
        } else {
            console.error('获取故障记录失败:', res.msg);
            faultRecords.value = [];
        }
    } catch (error) {
        console.error('获取故障记录异常:', error);
        faultRecords.value = [];
    }
};

/**
 * 获取维护记录数据
 * @param deviceCode 设备编码
 */
const fetchMaintenanceRecords = async (deviceCode: string) => {
    try {
        const res = await getMaintenanceRecords(deviceCode);
        console.log('维护记录API响应:', res);
        
        if (res.code === 200 && res.data && res.data.list) {
            // 转换API数据格式为表格显示格式
            // maintenanceTime->时间，maintenanceType->维护类型，maintenanceStatus->使用状态，remark->备注，processResult->处理结果
            maintenanceRecords.value = res.data.list.map((item: MaintenanceRecordItem) => {
                console.log('维护记录项:', item);
                return {
                    time: item.maintenanceTime || '-',
                    type: item.maintenanceType || '-',
                    usage: item.maintenanceStatus || '-',
                    remark: item.remark || '-',
                    // 如果processResult为null，检查maintenanceStatus是否包含"完成"来判断
                    result: item.processResult || (item.maintenanceStatus?.includes('完成') ? '已处理' : '未处理')
                };
            });
        } else {
            console.error('获取维护记录失败:', res.msg);
            maintenanceRecords.value = [];
        }
    } catch (error) {
        console.error('获取维护记录异常:', error);
        maintenanceRecords.value = [];
    }
};

// ========== 添加维护记录表单 ==========
const showMaintenanceForm = ref(false);
const maintenanceFormRef = ref<FormInstance>();

const maintenanceForm = reactive({
    deviceId: '',
    type: '',
    status: '',
    remark: '',
    result: '已处理'
});

const maintenanceRules: FormRules = {
    deviceId: [{ required: true, message: '设备ID不能为空', trigger: 'blur' }],
    type: [{ required: true, message: '请选择维护类型', trigger: 'change' }],
    status: [{ required: true, message: '请选择使用状态', trigger: 'change' }],
    remark: [{ required: true, message: '请输入备注信息', trigger: 'blur' }],
    result: [{ required: true, message: '请选择处理结果', trigger: 'change' }]
};

// 监听弹窗打开，自动填充设备ID和处理结果
watch(showMaintenanceForm, (val) => {
    if (val) {
        maintenanceForm.deviceId = deviceDetail.deviceId;
        maintenanceForm.result = '已处理';
    } else {
        // 关闭时重置表单
        maintenanceForm.type = '';
        maintenanceForm.status = '';
        maintenanceForm.remark = '';
        maintenanceForm.result = '已处理';
        maintenanceFormRef.value?.resetFields();
    }
});

// 提交维护记录表单
const submitMaintenanceForm = async () => {
    if (!maintenanceFormRef.value) return;

    await maintenanceFormRef.value.validate(async (valid) => {
        if (valid) {
            try {
                // 调用创建维护记录API
                const res = await createMaintenanceRecord({
                    deviceCode: maintenanceForm.deviceId,
                    maintenanceType: maintenanceForm.type,
                    remark: maintenanceForm.remark,
                    processResult: '已处理',
                    maintenanceStatus: maintenanceForm.status
                });

                if (res.code === 200) {
                    console.log('创建维护记录成功:', res);
                    // 刷新维护记录列表
                    fetchMaintenanceRecords(maintenanceForm.deviceId);
                    showMaintenanceForm.value = false;
                } else {
                    console.error('创建维护记录失败:', res.msg);
                }
            } catch (error) {
                console.error('创建维护记录异常:', error);
            }
        }
    });
};
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
    background-color: #fef0f0 !important;
    border-color: #fbc4c4 !important;
    color: #f56c6c !important;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
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

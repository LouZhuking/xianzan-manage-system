<template>
    <div class="sidebar">
        <!-- 管理员视图：供应商列表 -->
        <div v-if="isAdmin" class="supplier-list">
            <div 
                v-for="(item, index) in supplierList" 
                :key="index"
                :class="['supplier-item', { 'is-active': index === activeSupplierIndex }]"
                @click="handleSupplierClick(index)"
            >
                <!-- 左侧金色装饰条（仅选中项显示） -->
                <div v-if="index === activeSupplierIndex" class="sidebar-border"></div>
                
                <!-- 图标 -->
                <el-icon class="supplier-icon">
                    <Document />
                </el-icon>
                
                <!-- 供应商名称 -->
                <span class="supplier-name">{{ item.name }}</span>
                
                <!-- 徽章 -->
                <span v-if="item.badge" class="supplier-badge">{{ item.badge }}</span>
            </div>
        </div>

        <!-- 供应商视图：供应商名称 + 设备列表 -->
        <div v-else class="device-list-view">
            <!-- 供应商标题 -->
            <div class="supplier-header">
                <el-icon class="header-icon">
                    <OfficeBuilding />
                </el-icon>
                <span class="header-title">{{ currentSupplierName }}</span>
            </div>
            
            <!-- 设备列表 -->
            <div class="device-list">
                <div 
                    v-for="(device, index) in deviceList" 
                    :key="device.id"
                    :class="['device-item', { 'is-active': index === activeDeviceIndex }]"
                    @click="handleDeviceClick(index, device)"
                >
                    <!-- 左侧金色装饰条（仅选中项显示） -->
                    <div v-if="index === activeDeviceIndex" class="sidebar-border"></div>
                    
                    <!-- 设备图标 -->
                    <el-icon class="device-icon">
                        <Monitor />
                    </el-icon>
                    
                    <!-- 设备名称 -->
                    <span class="device-name">{{ device.name }}</span>
                    
                    <!-- 设备状态指示器 -->
                    <span :class="['device-status', device.status]"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Document, Monitor, OfficeBuilding } from '@element-plus/icons-vue';
import { useSidebarStore, type DeviceInfo } from '@/store/sidebar';
import { usePermissStore } from '@/store/permiss';

const sidebarStore = useSidebarStore();
const permissStore = usePermissStore();

// 判断是否为管理员（使用permiss store的角色判断）
const isAdmin = computed(() => permissStore.isAdmin);

// ========== 管理员视图数据 ==========
// 供应商列表假数据
const supplierList = ref([
    { name: '供应商总览', badge: null },
    { name: '供应商1号', badge: '9' },
    { name: '供应商2号', badge: '9' },
    { name: '供应商3号', badge: null },
    { name: '供应商4号', badge: null },
    { name: '供应商5号', badge: null },
    { name: '供应商6号', badge: null },
    { name: '供应商7号', badge: null },
    { name: '供应商8号', badge: null },
    { name: '供应商9号', badge: null },
    { name: '供应商10号', badge: null },
    { name: '供应商11号', badge: null },
    { name: '供应商12号', badge: null },
    { name: '供应商13号', badge: null },
    { name: '供应商14号', badge: null },
]);

// 当前选中的供应商索引
const activeSupplierIndex = computed(() => sidebarStore.activeSupplier?.index ?? null);

// 处理供应商点击事件
const handleSupplierClick = (index: number) => {
    sidebarStore.setActiveSupplier(index, supplierList.value[index].name);
};

// ========== 供应商视图数据 ==========
// 当前供应商名称
const currentSupplierName = computed(() => {
    return sidebarStore.currentSupplierInfo?.name || '供应商1号';
});

// 设备列表
const deviceList = computed(() => sidebarStore.deviceList);

// 当前选中的设备索引
const activeDeviceIndex = computed(() => sidebarStore.activeDevice?.index ?? null);

// 处理设备点击事件
const handleDeviceClick = (index: number, device: DeviceInfo) => {
    sidebarStore.setActiveDevice(index, device.id, device.name);
};

// 初始化供应商数据（非管理员时）
onMounted(() => {
    if (!isAdmin.value) {
        // 模拟获取当前供应商的设备数据
        // 实际项目中应该从API获取
        const mockSupplierData = {
            id: 'supplier_1',
            name: '供应商1号',
            badge: '9',
            devices: [
                { id: 'WOA00001', name: 'WOA00001', status: 'online' as const },
                { id: 'WOA00002', name: 'WOA00002', status: 'online' as const },
                { id: 'WOA00003', name: 'WOA00003', status: 'offline' as const },
                { id: 'WOA00004', name: 'WOA00004', status: 'online' as const },
                { id: 'WOA00005', name: 'WOA00005', status: 'fault' as const },
                { id: 'WOA00006', name: 'WOA00006', status: 'online' as const },
                { id: 'WOA00007', name: 'WOA00007', status: 'online' as const },
                { id: 'WOA00008', name: 'WOA00008', status: 'offline' as const },
                { id: 'WOA00009', name: 'WOA00009', status: 'online' as const },
            ]
        };
        sidebarStore.setCurrentSupplierInfo(mockSupplierData);
    }
});
</script>

<style scoped>
.sidebar {
    display: block;
    position: relative;
    width: 200px;
    height: calc(100vh - 70px);
    background-color: #fff;
    overflow-y: auto;
}

/* 隐藏滚动条 */
.sidebar::-webkit-scrollbar {
    width: 0;
}

/* 左侧金色装饰条（跟随选中项） */
.sidebar-border {
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background-color: #D4AF37;
    z-index: 1;
    border-radius: 0 2px 2px 0;
}

/* 供应商列表容器 */
.supplier-list {
    padding: 8px 0;
}

/* 供应商列表项 */
.supplier-item {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    margin: 2px 0;
    cursor: pointer;
    transition: background-color 0.3s;
    position: relative;
}

/* 普通项 hover 效果 */
.supplier-item:hover {
    background-color: #f5f5f5;
}

/* 第一项（供应商总览）的特殊样式 */
.supplier-item.is-active {
    background-color: #FFF7E6;
}

.supplier-item.is-active:hover {
    background-color: #FFF7E6;
}

/* 图标样式 */
.supplier-icon {
    font-size: 18px;
    color: #999;
    margin-right: 12px;
    flex-shrink: 0;
}

/* 第一项图标为金色 */
.supplier-item.is-active .supplier-icon {
    color: #D4AF37;
}

/* 供应商名称 */
.supplier-name {
    flex: 1;
    font-size: 14px;
    color: #333;
}

/* 徽章样式 */
.supplier-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    background-color: #f56c6c;
    color: #fff;
    font-size: 12px;
    border-radius: 10px;
    font-weight: 500;
}

/* ========== 供应商视图样式 ========== */
.device-list-view {
    padding: 0;
}

/* 供应商标题头部 */
.supplier-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, #FFF7E6 0%, #fff 100%);
    border-bottom: 1px solid #f0f0f0;
}

.header-icon {
    font-size: 22px;
    color: #D4AF37;
    margin-right: 10px;
}

.header-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

/* 设备列表容器 */
.device-list {
    padding: 8px 0;
}

/* 设备列表项 */
.device-item {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    margin: 2px 0;
    cursor: pointer;
    transition: background-color 0.3s;
    position: relative;
}

/* 设备项 hover 效果 */
.device-item:hover {
    background-color: #f5f5f5;
}

/* 选中的设备项 */
.device-item.is-active {
    background-color: #FFF7E6;
}

.device-item.is-active:hover {
    background-color: #FFF7E6;
}

/* 设备图标样式 */
.device-icon {
    font-size: 18px;
    color: #999;
    margin-right: 12px;
    flex-shrink: 0;
}

/* 选中项图标为金色 */
.device-item.is-active .device-icon {
    color: #D4AF37;
}

/* 设备名称 */
.device-name {
    flex: 1;
    font-size: 14px;
    color: #333;
}

/* 设备状态指示器 */
.device-status {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.device-status.online {
    background-color: #52c41a;
}

.device-status.offline {
    background-color: #999;
}

.device-status.fault {
    background-color: #f56c6c;
}
</style>

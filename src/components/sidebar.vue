<template>
    <div class="sidebar">
        <!-- 管理员视图：供应商列表 -->
        <div v-if="isAdmin" class="supplier-list">
            <!-- 加载状态 -->
            <div v-if="loading" class="loading-wrapper">
                <el-icon class="is-loading"><Loading /></el-icon>
                <span>加载中...</span>
            </div>
            <template v-else>
                <div 
                    v-for="(item, index) in supplierList" 
                    :key="item.id"
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
                    
                    <!-- 徽章（显示设备数量） -->
                    <span v-if="item.badge" class="supplier-badge">{{ item.badge }}</span>
                </div>
            </template>
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
            
            <!-- 加载状态 -->
            <div v-if="loading" class="loading-wrapper">
                <el-icon class="is-loading"><Loading /></el-icon>
                <span>加载中...</span>
            </div>
            
            <!-- 设备列表 -->
            <div v-else class="device-list">
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
import { computed, onMounted } from 'vue';
import { Document, Monitor, OfficeBuilding, Loading } from '@element-plus/icons-vue';
import { useSidebarStore, type DeviceInfo, type SupplierInfo } from '@/store/sidebar';
import { usePermissStore } from '@/store/permiss';

const sidebarStore = useSidebarStore();
const permissStore = usePermissStore();

// 判断是否为管理员（使用permiss store的角色判断）
const isAdmin = computed(() => permissStore.isAdmin);

// ========== 管理员视图数据 ==========
// 供应商列表（从store获取）
const supplierList = computed(() => {
    // 在列表前添加"供应商总览"选项
    const overview = { id: 0, name: '供应商总览', badge: null, devices: [] };
    return [overview, ...sidebarStore.supplierList];
});

// 数据加载状态
const loading = computed(() => sidebarStore.loading);

// 当前选中的供应商索引
const activeSupplierIndex = computed(() => sidebarStore.activeSupplier?.index ?? null);

// 处理供应商点击事件
const handleSupplierClick = (index: number) => {
    const supplier = supplierList.value[index];
    sidebarStore.setActiveSupplier(index, supplier.name);
    
    // 如果点击的不是"供应商总览"，可以设置当前供应商信息
    if (index > 0) {
        sidebarStore.setCurrentSupplierInfo(supplier);
    }
};

// ========== 供应商视图数据 ==========
// 当前供应商名称
const currentSupplierName = computed(() => {
    return sidebarStore.currentSupplierInfo?.name || '供应商';
});

// 设备列表
const deviceList = computed(() => sidebarStore.deviceList);

// 当前选中的设备索引
const activeDeviceIndex = computed(() => sidebarStore.activeDevice?.index ?? null);

// 处理设备点击事件
const handleDeviceClick = (index: number, device: DeviceInfo) => {
    sidebarStore.setActiveDevice(index, device.id, device.name);
};

// 初始化数据
const initData = async () => {
    // 从API获取供应商设备列表
    const list = await sidebarStore.fetchDealerDeviceList();
    console.log('获取到的供应商列表:', list);
    console.log('是否为管理员:', isAdmin.value);
    
    if (!isAdmin.value && list.length > 0) {
        // 非管理员：根据dealerId匹配当前用户的供应商
        const userDealerId = localStorage.getItem('vuems_dealerId');
        console.log('用户dealerId:', userDealerId);
        if (userDealerId) {
            const userSupplier = list.find((s: SupplierInfo) => s.id === Number(userDealerId));
            if (userSupplier) {
                sidebarStore.setCurrentSupplierInfo(userSupplier);
            } else {
                // 如果没找到匹配的，使用第一个
                sidebarStore.setCurrentSupplierInfo(list[0]);
            }
        } else {
            // 没有dealerId，使用第一个供应商
            sidebarStore.setCurrentSupplierInfo(list[0]);
        }
    }
};

onMounted(() => {
    initData();
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

/* 加载状态样式 */
.loading-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: #999;
    font-size: 14px;
}

.loading-wrapper .is-loading {
    font-size: 24px;
    margin-bottom: 10px;
    animation: rotating 2s linear infinite;
}

@keyframes rotating {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>

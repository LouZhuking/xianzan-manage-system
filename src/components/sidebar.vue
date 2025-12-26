<template>
    <div class="sidebar">
        <!-- 管理员视图：二级导航 -->
        <div v-if="isAdmin" class="nested-nav">
            <!-- 加载状态 -->
            <div v-if="loading" class="loading-wrapper">
                <el-icon class="is-loading"><Loading /></el-icon>
                <span>加载中...</span>
            </div>
            <template v-else>
                <!-- 供应商总览 -->
                <div 
                    :class="['nav-item', 'overview-item', { 'is-active': isOverviewActive }]"
                    @click="handleOverviewClick"
                >
                    <div v-if="isOverviewActive" class="sidebar-border"></div>
                    <el-icon class="nav-icon">
                        <Document />
                    </el-icon>
                    <span class="nav-name">供应商总览</span>
                </div>

                <!-- 供应商列表（可展开） -->
                <div 
                    v-for="supplier in sidebarStore.supplierList" 
                    :key="supplier.id"
                    class="supplier-group"
                >
                    <!-- 供应商父项 -->
                    <div 
                        :class="['nav-item', 'supplier-parent', { 'is-expanded': !isSupplierOnlyMode && isExpanded(supplier.id), 'is-active': isSupplierActive(supplier.id) }]"
                        @click="handleSupplierToggle(supplier.id)"
                    >
                        <!-- 左侧金色装饰条（仅选中项显示） -->
                        <div v-if="isSupplierActive(supplier.id)" class="sidebar-border"></div>
                        <!-- 展开/折叠图标（仅在完整导航模式下显示） -->
                        <el-icon v-if="!isSupplierOnlyMode" class="expand-icon">
                            <ArrowDown v-if="isExpanded(supplier.id)" />
                            <ArrowRight v-else />
                        </el-icon>
                        <span class="nav-name">{{ supplier.name }}</span>
                        <span v-if="supplier.badge && !isSupplierOnlyMode" class="supplier-badge">{{ supplier.badge }}</span>
                    </div>

                    <!-- 设备子列表（仅在完整导航模式下显示） -->
                    <div v-if="!isSupplierOnlyMode" v-show="isExpanded(supplier.id)" class="device-children">
                        <div 
                            v-for="device in supplier.devices" 
                            :key="device.id"
                            :class="['nav-item', 'device-child', { 'is-active': isDeviceActive(device.id) }]"
                            @click="handleDeviceClick(device, supplier.id)"
                        >
                            <div v-if="isDeviceActive(device.id)" class="sidebar-border"></div>
                            <el-icon class="device-icon">
                                <Monitor />
                            </el-icon>
                            <span class="device-name">{{ device.name }}</span>
                            <span :class="['device-status', device.status]"></span>
                        </div>
                        <!-- 无设备提示 -->
                        <div v-if="!supplier.devices || supplier.devices.length === 0" class="no-device">
                            暂无设备
                        </div>
                    </div>
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
                    @click="handleSupplierDeviceClick(index, device)"
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
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Document, Monitor, OfficeBuilding, Loading, ArrowRight, ArrowDown } from '@element-plus/icons-vue';
import { useSidebarStore, type DeviceInfo, type SupplierInfo } from '@/store/sidebar';
import { usePermissStore } from '@/store/permiss';

const route = useRoute();
const sidebarStore = useSidebarStore();
const permissStore = usePermissStore();

// 判断是否为管理员（使用permiss store的角色判断）
const isAdmin = computed(() => permissStore.isAdmin);

// 定义仅供应商模式的路由列表
const supplierOnlyRoutes = ['/revenue-flow', '/order-system'];

// 计算当前是否为仅供应商模式（管理员 + 特定路由）
const isSupplierOnlyMode = computed(() => {
    return isAdmin.value && supplierOnlyRoutes.includes(route.path);
});

// 数据加载状态
const loading = computed(() => sidebarStore.loading);

// ========== 管理员视图：二级导航 ==========
// 是否选中供应商总览
const isOverviewActive = computed(() => {
    return sidebarStore.activeSupplier?.index === 0 && !sidebarStore.activeDevice;
});

// 检查供应商是否展开
const isExpanded = (supplierId: number): boolean => {
    return sidebarStore.isSupplierExpanded(supplierId);
};

// 检查供应商是否选中（当前激活）
const isSupplierActive = (supplierId: number): boolean => {
    // 当前供应商信息的ID与传入的ID匹配，且没有选中设备
    return sidebarStore.currentSupplierInfo?.id === supplierId && !sidebarStore.activeDevice;
};

// 检查设备是否选中
const isDeviceActive = (deviceId: string): boolean => {
    return sidebarStore.activeDevice?.id === deviceId;
};

// 处理供应商总览点击
const handleOverviewClick = () => {
    sidebarStore.setActiveSupplier(0, '供应商总览');
    sidebarStore.activeDevice = null;
};

// 处理供应商展开/折叠（同时选中该供应商）
const handleSupplierToggle = (supplierId: number) => {
    // 找到供应商在列表中的索引（+1 因为索引0是"供应商总览"）
    const supplierIndex = sidebarStore.supplierList.findIndex(s => s.id === supplierId);
    if (supplierIndex !== -1) {
        const supplier = sidebarStore.supplierList[supplierIndex];
        // 设置当前选中的供应商（索引+1因为0是总览）
        sidebarStore.setActiveSupplier(supplierIndex + 1, supplier.name);
        // 设置当前供应商信息，用于右侧页面显示
        sidebarStore.setCurrentSupplierInfo(supplier);
        // 清除设备选中状态
        sidebarStore.activeDevice = null;
        
        // 仅在完整导航模式下切换展开状态
        if (!isSupplierOnlyMode.value) {
            sidebarStore.toggleSupplierExpand(supplierId);
        }
    }
};

// 处理设备点击
const handleDeviceClick = (device: DeviceInfo, supplierId: number) => {
    // 找到设备在列表中的索引
    const supplier = sidebarStore.supplierList.find(s => s.id === supplierId);
    const deviceIndex = supplier?.devices?.findIndex(d => d.id === device.id) ?? 0;
    sidebarStore.setActiveDevice(deviceIndex, device.id, device.name);
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

// 处理供应商视图的设备点击事件
const handleSupplierDeviceClick = (index: number, device: DeviceInfo) => {
    sidebarStore.setActiveDevice(index, device.id, device.name);
};

// 初始化数据
const initData = async () => {
    // 从API获取供应商设备列表
    const list = await sidebarStore.fetchDealerDeviceList();
    console.log('获取到的供应商列表:', list);
    console.log('是否为管理员:', isAdmin.value);
    
    if (isAdmin.value) {
        // 管理员：默认选中供应商总览
        if (!sidebarStore.activeSupplier) {
            sidebarStore.setActiveSupplier(0, '供应商总览');
        }
    } else if (list.length > 0) {
        // 非管理员：根据dealerId匹配当前用户的供应商
        const userDealerId = localStorage.getItem('vuems_dealerId');
        console.log('用户dealerId:', userDealerId);
        if (userDealerId) {
            const userSupplier = list.find((s: SupplierInfo) => s.id === Number(userDealerId));
            if (userSupplier) {
                sidebarStore.setCurrentSupplierInfo(userSupplier);
            } else {
                sidebarStore.setCurrentSupplierInfo(list[0]);
            }
        } else {
            sidebarStore.setCurrentSupplierInfo(list[0]);
        }
    }
};

// 监听路由变化，处理模式切换
watch(() => route.path, (newPath, oldPath) => {
    if (!isAdmin.value) return;
    
    const wasSupplierOnly = supplierOnlyRoutes.includes(oldPath);
    const isNowSupplierOnly = supplierOnlyRoutes.includes(newPath);
    
    // 从完整导航模式切换到仅供应商模式时，折叠所有展开的供应商
    if (!wasSupplierOnly && isNowSupplierOnly) {
        sidebarStore.collapseAllSuppliers();
    }
});

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

/* ========== 二级导航样式 ========== */
.nested-nav {
    padding: 8px 0;
}

/* 通用导航项样式 */
.nav-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    margin: 2px 0;
    cursor: pointer;
    transition: background-color 0.3s;
    position: relative;
}

.nav-item:hover {
    background-color: #f5f5f5;
}

.nav-item.is-active {
    background-color: #FFF7E6;
}

.nav-item.is-active:hover {
    background-color: #FFF7E6;
}

/* 导航图标 */
.nav-icon {
    font-size: 18px;
    color: #999;
    margin-right: 12px;
    flex-shrink: 0;
}

.nav-item.is-active .nav-icon {
    color: #D4AF37;
}

/* 导航名称 */
.nav-name {
    flex: 1;
    font-size: 14px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 供应商总览项 */
.overview-item {
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 4px;
}

/* 供应商父项 */
.supplier-parent {
    padding-left: 12px;
}

.supplier-parent.is-expanded {
    background-color: #fafafa;
}

.supplier-parent.is-active {
    background-color: #FFF7E6;
}

.supplier-parent.is-active .expand-icon {
    color: #D4AF37;
}

.supplier-parent.is-active .nav-name {
    color: #333;
    font-weight: 500;
}

/* 展开/折叠图标 */
.expand-icon {
    font-size: 12px;
    color: #999;
    margin-right: 8px;
    flex-shrink: 0;
    transition: transform 0.3s;
}

.supplier-parent.is-expanded .expand-icon {
    color: #D4AF37;
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

/* 设备子列表容器 */
.device-children {
    background-color: #fafafa;
}

/* 设备子项 */
.device-child {
    padding-left: 36px;
    padding-right: 16px;
    padding-top: 10px;
    padding-bottom: 10px;
}

.device-child .device-icon {
    font-size: 16px;
    color: #bbb;
    margin-right: 10px;
}

.device-child.is-active .device-icon {
    color: #D4AF37;
}

.device-child .device-name {
    font-size: 13px;
    color: #666;
}

.device-child.is-active .device-name {
    color: #333;
    font-weight: 500;
}

/* 无设备提示 */
.no-device {
    padding: 12px 36px;
    font-size: 12px;
    color: #999;
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

/* 设备图标样式 - 供应商视图 */
.device-list .device-icon {
    font-size: 18px;
    color: #999;
    margin-right: 12px;
    flex-shrink: 0;
}

/* 选中项图标为金色 */
.device-item.is-active .device-icon {
    color: #D4AF37;
}

/* 设备名称 - 供应商视图 */
.device-list .device-name {
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

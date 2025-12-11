<template>
    <div class="sidebar">
        <!-- 供应商列表 -->
        <div class="supplier-list">
            <div 
                v-for="(item, index) in supplierList" 
                :key="index"
                :class="['supplier-item', { 'is-active': index === activeIndex }]"
                @click="handleItemClick(index)"
            >
                <!-- 左侧金色装饰条（仅选中项显示） -->
                <div v-if="index === activeIndex" class="sidebar-border"></div>
                
                <!-- 图标 -->
                <el-icon class="supplier-icon">
                    <Document />
                </el-icon>
                
                <!-- 供应商名称 -->
                <span class="supplier-name">{{ item.name }}</span>
                
                <!-- 徽章（仅供应商1号和2号显示） -->
                <span v-if="item.badge" class="supplier-badge">{{ item.badge }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Document } from '@element-plus/icons-vue';

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

// 当前选中的供应商索引（默认不选中任何项）
const activeIndex = ref<number | null>(null);

// 处理点击事件
const handleItemClick = (index: number) => {
    activeIndex.value = index;
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: relative;
    width: 250px;
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
</style>

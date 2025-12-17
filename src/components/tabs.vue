<template>
    <div class="breadcrumb-container">
        <div class="breadcrumb-left">
            <span class="breadcrumb-label">您当前的位置：</span>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item 
                    v-for="(item, index) in breadcrumbList" 
                    :key="index"
                    :to="index < breadcrumbList.length - 1 ? item.path : ''"
                >
                    {{ item.title }}{{ breadcrumbSuffix ? ' / ' + breadcrumbSuffix : '' }}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="breadcrumb-right">
            <el-input
                v-model="searchValue"
                placeholder="搜索供应商名称..."
                :prefix-icon="Search"
                clearable
                @input="handleSearch"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
import { useSidebarStore } from '@/store/sidebar';
import { usePermissStore } from '@/store/permiss';

const route = useRoute();
const sidebarStore = useSidebarStore();
const permissStore = usePermissStore();
const searchValue = ref('');

// 判断是否为经销商（供应商）
const isSupplier = computed(() => permissStore.isSupplier);

// 面包屑列表
const breadcrumbList = computed(() => {
    const matched = route.matched.filter((item) => item.meta && item.meta.title);
    return matched.map((item) => ({
        title: item.meta.title as string,
        path: item.path,
    }));
});

// 当前选中的供应商名称（管理员视图）
const activeSupplierName = computed(() => sidebarStore.activeSupplier?.name || '');

// 当前选中的设备型号（经销商视图）
const activeDeviceName = computed(() => sidebarStore.activeDevice?.name || '');

// 面包屑后缀显示内容：经销商显示设备型号，管理员显示供应商名称
const breadcrumbSuffix = computed(() => {
    if (isSupplier.value) {
        return activeDeviceName.value;
    }
    return activeSupplierName.value;
});

// 搜索事件
const emit = defineEmits(['search']);
const handleSearch = (value: string) => {
    emit('search', value);
};
</script>

<style scoped>
.breadcrumb-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: #fff;
    border-bottom: 1px solid #ebeef5;
}

.breadcrumb-left {
    display: flex;
    align-items: center;
}

.breadcrumb-label {
    font-size: 14px;
    color: #606266;
    margin-right: 4px;
}

.breadcrumb-left :deep(.el-breadcrumb) {
    font-size: 14px;
}

.breadcrumb-left :deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
        color: #606266;
    }
    &:last-child .el-breadcrumb__inner {
        color: #303133;
    }
}

.breadcrumb-right {
    width: 200px;
}

.breadcrumb-right :deep(.el-input__wrapper) {
    border-radius: 4px;
}
</style>

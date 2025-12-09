<template>
    <div class="container">
        <div class="page-header">
            <h2>设备管理</h2>
            <p>管理和监控所有设备信息</p>
        </div>
        
        <!-- 搜索和操作区域 -->
        <div class="handle-box">
            <el-input 
                v-model="query.name" 
                placeholder="设备名称" 
                class="handle-input mr10"
                clearable
            ></el-input>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增设备</el-button>
        </div>

        <!-- 设备列表表格 -->
        <el-table 
            :data="tableData" 
            border 
            class="table" 
            header-cell-class-name="table-header"
            v-loading="loading"
        >
            <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
            <el-table-column prop="deviceName" label="设备名称" align="center"></el-table-column>
            <el-table-column prop="deviceType" label="设备类型" align="center"></el-table-column>
            <el-table-column prop="deviceCode" label="设备编码" align="center"></el-table-column>
            <el-table-column prop="location" label="位置" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
                <template #default="scope">
                    <el-tag :type="scope.row.status === '运行中' ? 'success' : scope.row.status === '维护中' ? 'warning' : 'danger'">
                        {{ scope.row.status }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="添加时间" align="center"></el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)">删除</el-button>
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

<script setup lang="ts" name="device-manage">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';

// 定义设备数据接口
interface DeviceItem {
    id: number;
    deviceName: string;
    deviceType: string;
    deviceCode: string;
    location: string;
    status: string;
    createTime: string;
}

// 查询参数
const query = reactive({
    name: '',
    pageIndex: 1,
    pageSize: 10
});

// 表格数据
const tableData = ref<DeviceItem[]>([
    {
        id: 1,
        deviceName: '洗衣机001',
        deviceType: '洗衣机',
        deviceCode: 'DEV001',
        location: '1号楼1层',
        status: '运行中',
        createTime: '2024-12-01 10:00:00'
    },
    {
        id: 2,
        deviceName: '烘干机002',
        deviceType: '烘干机',
        deviceCode: 'DEV002',
        location: '1号楼2层',
        status: '空闲',
        createTime: '2024-12-01 10:30:00'
    },
    {
        id: 3,
        deviceName: '洗衣机003',
        deviceType: '洗衣机',
        deviceCode: 'DEV003',
        location: '2号楼1层',
        status: '维护中',
        createTime: '2024-12-01 11:00:00'
    }
]);

const pageTotal = ref(3);
const loading = ref(false);

// 搜索
const handleSearch = () => {
    ElMessage.success('搜索功能待实现');
};

// 新增设备
const handleAdd = () => {
    ElMessage.info('新增设备功能待实现');
};

// 编辑设备
const handleEdit = (index: number, row: DeviceItem) => {
    ElMessage.info(`编辑设备: ${row.deviceName}`);
};

// 删除设备
const handleDelete = (index: number) => {
    ElMessageBox.confirm('确定要删除该设备吗?', '提示', {
        type: 'warning'
    }).then(() => {
        ElMessage.success('删除成功');
        tableData.value.splice(index, 1);
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

.red {
    color: #f56c6c;
}

.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>

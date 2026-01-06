<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="header-left">
            <img class="logo" src="../assets/img/logo.svg" alt="" />
            <div class="web-title">后台管理系统</div>
            <!-- 横向导航栏 -->
            <div class="nav-tabs">
                <div 
                    v-for="item in navTabs" 
                    :key="item.path"
                    :class="['nav-tab-item', { 'active': isActive(item.path) }]"
                    @click="handleNavClick(item.path)"
                >
                    {{ item.title }}
                </div>
            </div>
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 用户头像 -->
                <el-avatar class="user-avator" :size="30" :src="imgurl" />
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ username }}
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRouter, useRoute } from 'vue-router';
import imgurl from '../assets/img/img.jpg';

// 导航栏数据定义
interface NavTab {
    path: string;
    title: string;
}

const navTabs: NavTab[] = [
    { path: '/device-manage', title: '设备管理' },
    { path: '/revenue-flow', title: '营收流水' },
    { path: '/order-system', title: '订单系统' },
];

const username: string | null = localStorage.getItem('vuems_name');
const message: number = 2;

const sidebar = useSidebarStore();
// 侧边栏折叠
const collapseChage = () => {
    sidebar.handleCollapse();
};

onMounted(() => {
    if (document.body.clientWidth < 1500) {
        collapseChage();
    }
});

// 用户名下拉菜单选择事件
const router = useRouter();
const route = useRoute();

// 导航栏点击事件
const handleNavClick = (path: string) => {
    router.push(path);
};

// 判断当前导航是否激活
const isActive = (path: string) => {
    return route.path === path;
};
const handleCommand = (command: string) => {
    if (command == 'loginout') {
        localStorage.removeItem('vuems_name');
        router.push('/login');
    } else if (command == 'user') {
        router.push('/ucenter');
    }
};

const setFullScreen = () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.body.requestFullscreen.call(document.body);
    }
};
</script>
<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    color: var(--header-text-color);
    background-color: var(--header-bg-color);
    border-bottom: 1px solid #ddd;
}

.header-left {
    display: flex;
    align-items: center;
    padding-left: 20px;
    height: 100%;
    flex: 1;
}

.logo {
    width: 35px;
}

.web-title {
    margin: 0 40px 0 10px;
    font-size: 22px;
}

.collapse-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    cursor: pointer;
    opacity: 0.8;
    font-size: 22px;
}

.collapse-btn:hover {
    opacity: 1;
}

.header-right {
    float: right;
    padding-right: 50px;
}

.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}

.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}

.btn-icon {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: var(--header-text-color);
    margin: 0 5px;
    font-size: 20px;
}

.btn-bell-badge {
    position: absolute;
    right: 4px;
    top: 0px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: var(--header-text-color);
}

.user-avator {
    margin: 0 10px 0 20px;
}

.el-dropdown-link {
    color: var(--header-text-color);
    cursor: pointer;
    display: flex;
    align-items: center;
}

.el-dropdown-menu__item {
    text-align: center;
}

/* 横向导航栏样式 */
.nav-tabs {
    display: flex;
    align-items: center;
    margin-left: 40px;
    height: 100%;
}

.nav-tab-item {
    position: relative;
    padding: 0 24px;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 15px;
    color: var(--header-text-color);
    transition: all 0.3s ease;
    white-space: nowrap;
}

.nav-tab-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-tab-item.active {
    background-color: #d4a76a;
    color: #2c3e50;
    font-weight: 500;
}

.nav-tab-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background-color: #d4a76a;
}
</style>

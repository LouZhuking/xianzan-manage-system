<template>
    <div class="login-bg">
        <!-- 页面标题 -->
        <div class="login-title-wrapper">
            <div class="login-title">欢迎使用 <span class="title-wings">Wings</span> <span class="title-of">of</span> <span class="title-ai">AI</span></div>
        </div>

        <div class="login-container">
            <!-- 左侧：扫码登录 -->
            <div class="qrcode-section">
                <h3 class="section-title">扫码登录</h3>
                <div class="qrcode-box">
                    <img src="../../assets/img/logo.svg" alt="二维码" class="qrcode-image" />
                </div>
                <p class="qrcode-tips">使用XXXXAPP扫一维码登录</p>
            </div>

            <!-- 分隔线 -->
            <div class="divider"></div>

            <!-- 右侧：表单登录 -->
            <div class="form-section">
                <!-- 标签页切换 -->
                <el-tabs v-model="activeTab" class="login-tabs">
                    <!-- 账号密码登录 -->
                    <el-tab-pane label="账号密码登录" name="password">
                        <el-form :model="loginParam" :rules="loginRules" ref="loginForm" size="large">
                            <el-form-item prop="username">
                                <el-input v-model="loginParam.username" placeholder="输入账号/邮箱/电话ID">
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input
                                    type="password"
                                    placeholder="请输入登录密码"
                                    v-model="loginParam.password"
                                    @keyup.enter="handleLogin"
                                >
                                </el-input>
                            </el-form-item>
                            <!-- 记住密码和忘记密码 -->
                            <div class="password-options">
                                <el-checkbox v-model="rememberPassword" label="记住用户名" />
                            </div>
                            <el-button class="submit-btn" type="primary" size="large" :loading="loginLoading" @click="handleLogin">登录</el-button>
                            <!-- Tips提示 -->
                            <p class="login-tips">Tips：成功登录即代表注册成功</p>
                        </el-form>
                    </el-tab-pane>

                    <!-- 手机号登录 -->
                    <el-tab-pane label="手机号登录" name="phone">
                        <el-form :model="phoneParam" :rules="phoneRules" ref="phoneForm" size="large">
                            <el-form-item prop="phone">
                                <el-input v-model="phoneParam.phone" placeholder="请输入手机号">
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="code">
                                <div class="code-input-wrapper">
                                    <el-input v-model="phoneParam.code" placeholder="请输入验证码">
                                    </el-input>
                                    <el-button class="code-btn" :disabled="codeCountdown > 0" @click="sendCode">
                                        {{ codeCountdown > 0 ? `${codeCountdown}秒后重试` : '获取验证码' }}
                                    </el-button>
                                </div>
                            </el-form-item>
                            <el-button class="submit-btn" type="primary" size="large" @click="handlePhoneLogin">登录</el-button>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        


        <!-- 底部隐私协议提示 -->
        <p class="privacy-tips">登录/注册即同意并遵守<span class="link-text">隐私协议</span>和<span class="link-text">服务协议</span>，用户协议。</p>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTabsStore } from '@/store/tabs';
import { usePermissStore } from '@/store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { getToken, loginByAccount } from '@/api/index';

// 防抖函数
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number = 500) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return function (this: any, ...args: Parameters<T>) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
            timer = null;
        }, delay);
    };
}

// 定义接口类型
interface LoginInfo {
    username: string;
    password: string;
}

interface PhoneInfo {
    phone: string;
    code: string;
}

// 路由和store
const router = useRouter();
const permiss = usePermissStore();
const tabs = useTabsStore();
import { useSidebarStore } from '@/store/sidebar';
const sidebarStore = useSidebarStore();

// 当前激活的标签页
const activeTab = ref('password');

// 从localStorage读取记住的用户名（安全考虑：不再存储密码）
const savedUsername = localStorage.getItem('login-username');

// 记住用户名状态
const rememberPassword = ref(!!savedUsername);

// 登录按钮loading状态，防止重复点击
const loginLoading = ref(false);

// 账号密码登录表单
const loginForm = ref<FormInstance>();
const loginParam = reactive<LoginInfo>({
    username: savedUsername || '',
    password: '', // 安全修复：密码不再从localStorage恢复
});

// 账号密码登录验证规则
const loginRules: FormRules = {
    username: [
        {
            required: true,
            message: '请输入用户账号/邮箱/电话ID',
            trigger: 'blur',
        },
    ],
    password: [
        { 
            required: true, 
            message: '请输入登录密码', 
            trigger: 'blur' 
        }
    ],
};

// 手机号登录表单
const phoneForm = ref<FormInstance>();
const phoneParam = reactive<PhoneInfo>({
    phone: '',
    code: '',
});

// 验证码倒计时
const codeCountdown = ref(0);

// 手机号登录验证规则
const phoneRules: FormRules = {
    phone: [
        {
            required: true,
            message: '请输入手机号',
            trigger: 'blur',
        },
        {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur',
        },
    ],
    code: [
        {
            required: true,
            message: '请输入验证码',
            trigger: 'blur',
        },
    ],
};


// 账号密码登录处理（核心逻辑）
const doLogin = async () => {
    if (!loginForm.value) return;
    
    loginForm.value.validate(async (valid: boolean) => {
        if (valid) {
            // 防止重复提交
            if (loginLoading.value) return;
            loginLoading.value = true;
            
            try {
                // 第一步：使用固定账号获取 token
                console.log('=== 第一步：获取Token ===');
                const tokenResponse = await getToken({
                    userName: 'dm13918177314',
                    userPwd: 'a13918177314'
                });
                
                console.log('Token响应:', tokenResponse);
                
                if (tokenResponse.code !== 200 || !tokenResponse.data) {
                    ElMessage.error(tokenResponse.msg || '获取Token失败');
                    return;
                }
                
                const accessToken = tokenResponse.data;
                console.log('获取到Token:', accessToken);
                
                // 第二步：使用 token 调用登录接口
                console.log('=== 第二步：调用登录接口 ===');
                const loginResponse = await loginByAccount({
                    user: loginParam.username,
                    userPwd: loginParam.password
                }, accessToken);
                
                console.log('登录响应:', loginResponse);
                
                if (loginResponse.code === 200) {
                    // 保存token和用户信息
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('vuems_name', loginParam.username);
                    
                    // 根据后端返回的 roleId 设置权限和角色
                    // roleId = 1 → 管理员, roleId = 2 → 经销商
                    const userInfo = loginResponse.data?.userInfo;
                    const roleId = userInfo?.roleId;
                    
                    let userRole: 'admin' | 'supplier' | 'user' = 'user';
                    if (roleId === 1) {
                        userRole = 'admin';
                    } else if (roleId === 2) {
                        userRole = 'supplier';
                    }
                    
                    console.log('用户角色:', userRole, 'roleId:', roleId);
                    
                    const keys = permiss.defaultList[userRole];
                    permiss.handleSet(keys);
                    permiss.setRole(userRole);
                    
                    // 如果是经销商，设置经销商信息
                    if (userRole === 'supplier') {
                        sidebarStore.setCurrentSupplierInfo({
                            id: userInfo?.user || loginParam.username,
                            name: userInfo?.userName || '经销商',
                            badge: '9',
                            devices: [
                                { id: 'WOA00001', name: 'WOA00001', status: 'online' },
                                { id: 'WOA00002', name: 'WOA00002', status: 'online' },
                                { id: 'WOA00003', name: 'WOA00003', status: 'offline' },
                                { id: 'WOA00004', name: 'WOA00004', status: 'online' },
                                { id: 'WOA00005', name: 'WOA00005', status: 'fault' },
                                { id: 'WOA00006', name: 'WOA00006', status: 'online' },
                                { id: 'WOA00007', name: 'WOA00007', status: 'online' },
                                { id: 'WOA00008', name: 'WOA00008', status: 'offline' },
                                { id: 'WOA00009', name: 'WOA00009', status: 'online' },
                            ]
                        });
                    } else {
                        sidebarStore.clearSupplierInfo();
                    }
                    
                    // 记住用户名处理
                    if (rememberPassword.value) {
                        localStorage.setItem('login-username', loginParam.username);
                    } else {
                        localStorage.removeItem('login-username');
                    }
                    
                    ElMessage.success('登录成功');
                    router.push('/');
                } else {
                    ElMessage.error(loginResponse.msg || '登录失败');
                }
            } catch (error: any) {
                console.error('登录错误:', error);
            } finally {
                loginLoading.value = false;
            }
        } else {
            ElMessage.error('请检查输入信息');
            return false;
        }
    });
};

// 使用防抖包装登录函数，500ms内多次点击只执行最后一次
const handleLogin = debounce(doLogin, 500);

// 手机号登录处理
const handlePhoneLogin = () => {
    if (!phoneForm.value) return;
    phoneForm.value.validate((valid: boolean) => {
        if (valid) {
            // 模拟登录成功
            ElMessage.success('登录成功');
            localStorage.setItem('vuems_name', phoneParam.phone);
            const keys = permiss.defaultList['user'];
            permiss.handleSet(keys);
            router.push('/');
        } else {
            ElMessage.error('请检查输入信息');
            return false;
        }
    });
};

// 发送验证码
const sendCode = () => {
    if (!phoneParam.phone) {
        ElMessage.warning('请先输入手机号');
        return;
    }
    if (!/^1[3-9]\d{9}$/.test(phoneParam.phone)) {
        ElMessage.warning('请输入正确的手机号码');
        return;
    }
    
    // 模拟发送验证码
    ElMessage.success('验证码已发送');
    codeCountdown.value = 60;
    
    // 倒计时
    const timer = setInterval(() => {
        codeCountdown.value--;
        if (codeCountdown.value <= 0) {
            clearInterval(timer);
        }
    }, 1000);
};

// 清空tabs状态
tabs.clearTabs();
</script>

<style scoped>
/* 背景容器 */
.login-bg {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
}

/* 页面标题容器 */
.login-title-wrapper {
    text-align: center;
    margin-bottom: 30px;
}

.login-title {
    font-size: 32px;
    color: #333;
    font-weight: 600;
    letter-spacing: 1.5px;
}

/* Wings 斜体样式 */
.title-wings {
    font-style: italic;
    font-weight: 700;
}

/* of 普通样式 */
.title-of {
    font-weight: 400;
}

/* AI 金色样式 */
.title-ai {
    color: #D4A574;
    font-weight: 700;
}

/* 登录容器 - 左右两栏布局 */
.login-container {
    width: 767px;
    height: 442px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: stretch;
    overflow: hidden;
}

/* 左侧扫码登录区域 */
.qrcode-section {
    flex: 0 0 38%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 30px;
    background: #fafafa;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 30px 0;
}

.qrcode-box {
    width: 180px;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 20px;
}

.qrcode-image {
    width: 140px;
    height: 140px;
    object-fit: contain;
}

.qrcode-tips {
    font-size: 13px;
    color: #666;
    text-align: center;
    margin: 0;
    line-height: 1.5;
}

/* 分隔线 */
.divider {
    width: 1px;
    background: linear-gradient(to bottom, transparent, #e0e0e0 20%, #e0e0e0 80%, transparent);
}

/* 右侧表单登录区域 */
.form-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 40px 35px;
}

/* 标签页样式 */
.login-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
}

:deep(.el-tabs__header) {
    margin-bottom: 25px;
}

:deep(.el-tabs__nav-wrap::after) {
    height: 1px;
    background-color: #e4e7ed;
}

:deep(.el-tabs__item) {
    font-size: 14px;
    color: #666;
    font-weight: 500;
    padding: 0 12px;
}

:deep(.el-tabs__item.is-active) {
    color: #D4A574;
    font-weight: 600;
}

:deep(.el-tabs__active-bar) {
    background-color: #D4A574;
}

:deep(.el-tabs__item:hover) {
    color: #D4A574;
}

/* 表单样式 */
:deep(.el-form-item) {
    margin-bottom: 20px;
}

:deep(.el-input__wrapper) {
    border-radius: 4px;
    padding: 10px 12px;
    box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #D4A574 inset;
}

:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #D4A574 inset !important;
}

:deep(.el-input__inner) {
    font-size: 14px;
    color: #333;
}

:deep(.el-input__inner::placeholder) {
    color: #aaa;
}

/* 验证码输入框布局 */
.code-input-wrapper {
    display: flex;
    gap: 8px;
}

.code-input-wrapper :deep(.el-input) {
    flex: 1;
}

.code-btn {
    min-width: 100px;
    background: #fff;
    color: #D4A574;
    border: 1px solid #D4A574;
    border-radius: 4px;
    font-size: 13px;
}

.code-btn:hover:not(:disabled) {
    background: #D4A574;
    color: #fff;
}

.code-btn:disabled {
    background: #f5f5f5;
    color: #999;
    border-color: #ddd;
}

/* 记住密码和忘记密码选项 */
.password-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -10px;
    margin-bottom: 15px;
}

.password-options :deep(.el-checkbox) {
    color: #666;
    font-size: 13px;
}

.password-options :deep(.el-checkbox__label) {
    color: #666;
}

.password-options :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #D4A574;
    border-color: #D4A574;
}

.password-options :deep(.el-link) {
    font-size: 13px;
}

/* 登录按钮 */
.submit-btn {
    display: block;
    width: 100%;
    margin-top: 20px;
    background: linear-gradient(90deg, #D4A574 0%, #C89963 100%);
    border: none;
    border-radius: 4px;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 1px;
    height: 44px;
}

.submit-btn:hover {
    background: linear-gradient(90deg, #C89963 0%, #B88852 100%);
}

.submit-btn:active {
    background: linear-gradient(90deg, #B88852 0%, #A87741 100%);
}

/* Tips提示文字 */
.login-tips {
    font-size: 12px;
    color: #999;
    margin: 10px 0 0 0;
    text-align: left;
}


/* 底部隐私协议提示 */
.privacy-tips {
    font-size: 12px;
    color: #999;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 0;
    line-height: 1.6;
}

.link-text {
    color: #D4A574;
    cursor: pointer;
}

.link-text:hover {
    text-decoration: underline;
}
</style>

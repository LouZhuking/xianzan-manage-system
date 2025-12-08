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
                                <el-checkbox v-model="rememberPassword" label="记住密码" />
                            </div>
                            <el-button class="submit-btn" type="primary" size="large" @click="handleLogin">登录</el-button>
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

// 当前激活的标签页
const activeTab = ref('password');

// 从localStorage读取记住的登录信息
const savedLoginParam = localStorage.getItem('login-param');
const savedParam = savedLoginParam ? JSON.parse(savedLoginParam) : null;

// 记住密码状态
const rememberPassword = ref(!!savedParam);

// 账号密码登录表单
const loginForm = ref<FormInstance>();
const loginParam = reactive<LoginInfo>({
    username: savedParam ? savedParam.username : '',
    password: savedParam ? savedParam.password : '',
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


// 账号密码登录处理
const handleLogin = async () => {
    if (!loginForm.value) return;
    
    loginForm.value.validate(async (valid: boolean) => {
        if (valid) {
            try {
                // 调用 getToken 接口（参数名：username 和 userPwd）
                const response = await getToken({
                    userName: loginParam.username,   // 注意：参数名是 userName（驼峰命名）
                    userPwd: loginParam.password     // 注意：参数名是 userPwd
                });
                
                // 【调试日志】打印完整的响应数据结构
                console.log('=== 登录API完整响应 ===');
                console.log('完整响应对象:', response);
                console.log('response.code:', response.code);
                console.log('response.msg:', response.msg);
                console.log('response.data (token):', response.data);
                console.log('=====================');
                
                // 检查响应是否成功（后端返回 code: 200 表示成功）
                if (response.code === 200) {
                    // 保存token到localStorage（注意：data 直接就是 token 字符串）
                    const accessToken = response.data;
                    
                    // 验证 token 是否存在
                    if (!accessToken || typeof accessToken !== 'string') {
                        ElMessage.error('登录失败：未获取到访问令牌');
                        console.error('Token 为空或类型错误，完整响应:', response);
                        return;
                    }
                    
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('vuems_name', loginParam.username);
                    
                    // 设置权限
                    const keys = permiss.defaultList[loginParam.username === 'admin' ? 'admin' : 'user'];
                    permiss.handleSet(keys);
                    
                    // 记住密码处理
                    if (rememberPassword.value) {
                        localStorage.setItem('login-param', JSON.stringify(loginParam));
                    } else {
                        localStorage.removeItem('login-param');
                    }
                    
                    ElMessage.success('登录成功');
                    router.push('/');
                } else {
                    // 登录失败，显示服务器返回的错误信息（使用 msg 字段）
                    ElMessage.error(response.msg || '登录失败');
                }
            } catch (error: any) {
                // 请求失败处理（错误提示已在request.ts中统一处理）
                console.error('登录错误:', error);
                // 不需要再次显示错误提示，request.ts拦截器已经处理
            }
        } else {
            ElMessage.error('请检查输入信息');
            return false;
        }
    });
};


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

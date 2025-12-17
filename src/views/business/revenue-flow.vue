<template>
    <div class="page-wrapper">
        <!-- 左侧主内容区 -->
        <div class="main-content">
            <!-- 顶部账户信息栏 -->
            <div class="account-header">
                <div class="account-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
                        <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                    </svg>
                </div>
                <div class="account-info">
                    <span class="label">账户金额(元)</span>
                    <div class="amount-row">
                        <span class="amount">¥ 6666.00</span>
                        <span class="link">收支明细 >></span>
                    </div>
                </div>
                <div class="account-actions">
                    <button class="btn-primary">提现</button>
                    <button class="btn-outline">提现记录</button>
                </div>
            </div>

            <!-- 实时营收区块 -->
            <div class="section realtime-revenue">
                <div class="section-header">
                    <span class="section-title">实时营收</span>
                    <span class="update-time">数据更新于: 2024/11/27 10:48:45</span>
                </div>
                <div class="section-body">
                    <!-- 成交金额卡片 -->
                    <div class="stat-card">
                        <!-- 装饰箭头 -->
                        <div class="stat-card-decoration">
                            <svg viewBox="0 0 60 60" width="60" height="60">
                                <path d="M10 50 L30 20 L35 30 L55 5" stroke="#d4c4a0" stroke-width="3" fill="none" stroke-linecap="round"/>
                                <polygon points="52,2 58,8 50,10" fill="#d4c4a0"/>
                            </svg>
                        </div>
                        <!-- 钱袋图标 -->
                        <div class="stat-card-icon">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
                                <path d="M12 2C10.9 2 10 2.9 10 4H14C14 2.9 13.1 2 12 2ZM15.6 5H8.4C7.1 5 6 6.1 6 7.4V8C6 8 6 9 7 10C8 11 8 12 8 12V20C8 21.1 8.9 22 10 22H14C15.1 22 16 21.1 16 20V12C16 12 16 11 17 10C18 9 18 8 18 8V7.4C18 6.1 16.9 5 15.6 5Z"/>
                            </svg>
                        </div>
                        <!-- 标题 -->
                        <div class="stat-card-title">
                            <span>成交金额(元)</span>
                            <svg class="help-icon" viewBox="0 0 24 24" width="16" height="16" fill="#999">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                            </svg>
                        </div>
                        <!-- 金额 -->
                        <div class="stat-card-value">2000.00</div>
                        <!-- 分隔线 -->
                        <div class="stat-card-divider"></div>
                        <!-- 成交人数 -->
                        <div class="stat-card-footer">
                            <span class="dot"></span>
                            <span class="label">成交人数</span>
                            <span class="count">100</span>
                        </div>
                    </div>
                    <!-- 总流水折线图 -->
                    <div class="chart-area realtime-chart">
                        <div class="chart-title">总流水</div>
                        <div ref="realtimeChartRef" class="chart-container"></div>
                    </div>
                    <!-- AI风格饼图 -->
                    <div class="pie-chart-area ai-style-chart">
                        <div class="ai-style-header">
                            <div class="chart-title">AI风格</div>
                            <div class="tab-switch-btns">
                                <span 
                                    :class="['tab-btn', { active: aiStyleTab === 'amount' }]"
                                    @click="aiStyleTab = 'amount'"
                                >金额</span>
                                <span 
                                    :class="['tab-btn', { active: aiStyleTab === 'count' }]"
                                    @click="aiStyleTab = 'count'"
                                >次数</span>
                            </div>
                        </div>
                        <div class="ai-style-content">
                            <div ref="aiStyleChartRef" class="ai-pie-container"></div>
                            <div class="ai-style-legend">
                                <div class="legend-item">
                                    <span class="legend-dot" style="background: #F5A623;"></span>
                                    <span class="legend-text">萌化贴纸</span>
                                </div>
                                <div class="legend-item">
                                    <span class="legend-dot" style="background: #F57C00;"></span>
                                    <span class="legend-text">人物转绘</span>
                                </div>
                                <div class="legend-item">
                                    <span class="legend-dot" style="background: #2979FF;"></span>
                                    <span class="legend-text">萌版文旅</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 近7天营收数据区块 -->
            <div class="section weekly-revenue">
                <div class="section-header">
                    <span class="section-title">近7天营收数据</span>
                    <span class="update-time">数据更新于: 2024/11/27 10:48:45</span>
                </div>
                <div class="section-body">
                    <!-- 总流水柱状图 -->
                    <div class="chart-area weekly-chart">
                        <div ref="weeklyChartRef" class="chart-container-full"></div>
                    </div>
                    <!-- AI风格饼图 -->
                    <div class="pie-chart-area weekly-pie-chart">
                        <div class="ai-style-header">
                            <div class="chart-title">AI风格</div>
                            <div class="tab-switch-btns">
                                <span 
                                    :class="['tab-btn', { active: weeklyAiStyleTab === 'amount' }]"
                                    @click="weeklyAiStyleTab = 'amount'"
                                >金额</span>
                                <span 
                                    :class="['tab-btn', { active: weeklyAiStyleTab === 'count' }]"
                                    @click="weeklyAiStyleTab = 'count'"
                                >次数</span>
                            </div>
                        </div>
                        <div class="ai-style-content">
                            <div ref="weeklyAiStyleChartRef" class="ai-pie-container"></div>
                            <div class="ai-style-legend">
                                <div class="legend-item">
                                    <span class="legend-dot" style="background: #F5A623;"></span>
                                    <span class="legend-text">萌化贴纸</span>
                                </div>
                                <div class="legend-item">
                                    <span class="legend-dot" style="background: #F57C00;"></span>
                                    <span class="legend-text">人物转绘</span>
                                </div>
                                <div class="legend-item">
                                    <span class="legend-dot" style="background: #2979FF;"></span>
                                    <span class="legend-text">萌版文旅</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 实时营收表格区块 -->
            <div class="section revenue-table">
                <div class="section-header">
                    <span class="section-title">实时营收</span>
                    <div class="table-actions">
                        <span :class="{ active: tableTimeRange === 'yesterday' }" @click="tableTimeRange = 'yesterday'">昨天</span>
                        <span :class="{ active: tableTimeRange === 'week' }" @click="tableTimeRange = 'week'">近7天</span>
                        <span :class="{ active: tableTimeRange === 'month' }" @click="tableTimeRange = 'month'">近30天</span>
                        <button class="export-btn">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="section-body">
                    <table class="revenue-data-table">
                        <thead>
                            <tr>
                                <th class="col-device">设备名称</th>
                                <th class="col-number">使用人数(人)</th>
                                <th class="col-number">成交人数(人)</th>
                                <th class="col-amount sortable">
                                    近7天总流水(元)
                                    <svg class="sort-icon" viewBox="0 0 24 24" width="12" height="12" fill="#999">
                                        <path d="M7 10l5 5 5-5z"/>
                                    </svg>
                                </th>
                                <th class="col-amount sortable">
                                    萌化贴纸
                                    <svg class="sort-icon" viewBox="0 0 24 24" width="12" height="12" fill="#999">
                                        <path d="M7 10l5 5 5-5z"/>
                                    </svg>
                                </th>
                                <th class="col-amount sortable">
                                    人物转绘
                                    <svg class="sort-icon" viewBox="0 0 24 24" width="12" height="12" fill="#999">
                                        <path d="M7 10l5 5 5-5z"/>
                                    </svg>
                                </th>
                                <th class="col-amount sortable">
                                    萌版文旅
                                    <svg class="sort-icon" viewBox="0 0 24 24" width="12" height="12" fill="#999">
                                        <path d="M7 10l5 5 5-5z"/>
                                    </svg>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in tableData" :key="index">
                                <td class="col-device">
                                    <span class="device-indicator" :style="{ background: item.color }"></span>
                                    {{ item.name }}
                                </td>
                                <td class="col-number">{{ item.useCount }}</td>
                                <td class="col-number">{{ item.dealCount }}</td>
                                <td class="col-amount">¥{{ item.totalFlow }}</td>
                                <td class="col-amount">¥{{ item.sticker }}</td>
                                <td class="col-amount">¥{{ item.portrait }}</td>
                                <td class="col-amount">¥{{ item.travel }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 右侧排行榜侧边栏 -->
        <div class="sidebar">
            <div class="ranking-card">
                <div class="ranking-header">
                    <svg class="header-arrow left" viewBox="0 0 24 24" width="20" height="20">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="#F5A623"/>
                        <path d="M11.41 7.41L10 6l-6 6 6 6 1.41-1.41L6.83 12z" fill="#F5A623"/>
                    </svg>
                    <span>昨日营收榜单</span>
                    <svg class="header-arrow right" viewBox="0 0 24 24" width="20" height="20">
                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="#F5A623"/>
                        <path d="M12.59 16.59L14 18l6-6-6-6-1.41 1.41L17.17 12z" fill="#F5A623"/>
                    </svg>
                </div>
                <div class="ranking-summary">
                    <div class="ranking-amount">
                        <span class="label">昨日成交金额(元)</span>
                        <span class="value">2000.00</span>
                    </div>
                    <div class="ranking-stats">
                        <div class="stat-item">
                            <span class="stat-label">使用人数</span>
                            <span class="stat-value">120</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">成交人数</span>
                            <span class="stat-value">100</span>
                        </div>
                    </div>
                </div>
                <div class="ranking-list">
                    <div class="ranking-item top" v-for="i in 3" :key="'top-' + i">
                        <span class="rank-icon">
                            <svg viewBox="0 0 24 24" width="22" height="22">
                                <path d="M5 3h14v3l-3 3v2h6v2h-2v8h-2v-8h-2v8h-2v-8H8v8H6v-8H4v-8h6V9L7 6V3z" fill="#F5A623"/>
                                <circle cx="12" cy="6" r="2" fill="#F5A623"/>
                            </svg>
                            <span class="rank-num">{{ i }}</span>
                        </span>
                        <span class="name">{{ i === 1 ? '新天地广场3F' : (i === 2 ? '新天地广场2F' : '新天地广场1F') }}</span>
                        <span class="amount highlight">666 <span class="unit">元</span></span>
                    </div>
                    <div class="ranking-item" v-for="i in 8" :key="'normal-' + i">
                        <span class="rank">{{ i + 3 }}</span>
                        <span class="name">其他地址名称</span>
                        <span class="amount">666 <span class="unit">元</span></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="revenue-flow">
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const realtimeChartRef = ref<HTMLElement | null>(null);
const aiStyleChartRef = ref<HTMLElement | null>(null);
const aiStyleTab = ref<'amount' | 'count'>('count');
let aiStyleChart: echarts.ECharts | null = null;

// 近7天营收图表
const weeklyChartRef = ref<HTMLElement | null>(null);
const weeklyAiStyleChartRef = ref<HTMLElement | null>(null);
const weeklyAiStyleTab = ref<'amount' | 'count'>('amount');
let weeklyAiStyleChart: echarts.ECharts | null = null;

// 实时营收表格
const tableTimeRange = ref<'yesterday' | 'week' | 'month'>('week');
const tableData = ref([
    { name: '设备1', color: '#F5A623', useCount: 130, dealCount: 130, totalFlow: '6000.00', sticker: '6000.00', portrait: '6000.00', travel: '6000.00' },
    { name: '设备2', color: '#F5A623', useCount: 130, dealCount: 130, totalFlow: '6000.00', sticker: '6000.00', portrait: '6000.00', travel: '6000.00' },
    { name: '设备3', color: '#F5A623', useCount: 130, dealCount: 130, totalFlow: '6000.00', sticker: '6000.00', portrait: '6000.00', travel: '6000.00' },
    { name: '设备4', color: '#F5A623', useCount: 130, dealCount: 130, totalFlow: '6000.00', sticker: '6000.00', portrait: '6000.00', travel: '6000.00' },
]);

// 总流水折线图配置
const initRealtimeChart = () => {
    if (!realtimeChartRef.value) return;
    
    const chart = echarts.init(realtimeChartRef.value);
    
    // 模拟数据 - 10:00 到 22:00 的成交金额
    const xData = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    const yData = [0, 15, 28, 30, 45, 55, 70, 65, 45, 30, 20, 5, 0];
    
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: '{b}<br/>成交金额: ¥{c}',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#eee',
            borderWidth: 1,
            textStyle: {
                color: '#333'
            }
        },
        legend: {
            data: ['成交金额(元)'],
            right: 20,
            top: 0,
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 14,
            textStyle: {
                color: '#666',
                fontSize: 12
            }
        },
        grid: {
            left: 50,
            right: 30,
            top: 40,
            bottom: 30
        },
        xAxis: {
            type: 'category',
            data: xData,
            boundaryGap: false,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#999',
                fontSize: 12
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 80,
            interval: 20,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#999',
                fontSize: 12,
                formatter: '¥{value}'
            },
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: '成交金额(元)',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                showSymbol: false,
                emphasis: {
                    focus: 'series',
                    itemStyle: {
                        borderColor: '#7B68EE',
                        borderWidth: 2
                    }
                },
                lineStyle: {
                    width: 3,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: '#36D1DC' },
                        { offset: 0.5, color: '#5B86E5' },
                        { offset: 1, color: '#7B68EE' }
                    ])
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(91, 134, 229, 0.15)' },
                        { offset: 1, color: 'rgba(91, 134, 229, 0)' }
                    ])
                },
                data: yData
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', () => {
        chart.resize();
    });
};

// AI风格饼图配置
const initAiStyleChart = () => {
    if (!aiStyleChartRef.value) return;
    
    aiStyleChart = echarts.init(aiStyleChartRef.value);
    updateAiStyleChart();
    
    window.addEventListener('resize', () => {
        aiStyleChart?.resize();
    });
};

const updateAiStyleChart = () => {
    if (!aiStyleChart) return;
    
    // 根据tab切换数据
    const isCount = aiStyleTab.value === 'count';
    const data = isCount 
        ? [
            { value: 800, name: '萌化贴纸' },
            { value: 700, name: '人物转绘' },
            { value: 500, name: '萌版文旅' }
          ]
        : [
            { value: 1200, name: '萌化贴纸' },
            { value: 900, name: '人物转绘' },
            { value: 600, name: '萌版文旅' }
          ];
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const centerValue = isCount ? '2000个' : '¥2700';
    const percentage = '31%';
    
    const option = {
        color: ['#F5A623', '#F57C00', '#2979FF'],
        series: [
            // 外圈刻度装饰
            {
                type: 'gauge',
                center: ['50%', '50%'],
                radius: '92%',
                startAngle: 90,
                endAngle: -270,
                min: 0,
                max: 100,
                splitNumber: 40,
                pointer: { show: false },
                progress: { show: false },
                axisLine: {
                    lineStyle: {
                        width: 1,
                        color: [[1, 'transparent']]
                    }
                },
                axisTick: {
                    show: true,
                    splitNumber: 1,
                    length: 6,
                    distance: 0,
                    lineStyle: {
                        width: 1.5,
                        color: '#d0d0d0'
                    }
                },
                splitLine: { show: false },
                axisLabel: { show: false },
                detail: { show: false }
            },
            // 主饼图
            {
                type: 'pie',
                radius: ['48%', '70%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                padAngle: 2,
                itemStyle: {
                    borderRadius: 3
                },
                label: { show: false },
                emphasis: {
                    scale: true,
                    scaleSize: 4
                },
                labelLine: { show: false },
                data: data
            },
            // 中心文字
            {
                type: 'pie',
                radius: ['0%', '0%'],
                center: ['50%', '50%'],
                label: {
                    show: true,
                    position: 'center',
                    formatter: () => {
                        return `{value|${centerValue}}\n{percent|${percentage}}\n{name|名称名称}`;
                    },
                    rich: {
                        value: {
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#333',
                            lineHeight: 22
                        },
                        percent: {
                            fontSize: 14,
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            color: '#666',
                            lineHeight: 20
                        },
                        name: {
                            fontSize: 10,
                            color: '#999',
                            lineHeight: 14
                        }
                    }
                },
                data: [{ value: 0, name: '' }]
            }
        ]
    };
    
    aiStyleChart.setOption(option);
};

watch(aiStyleTab, () => {
    updateAiStyleChart();
});

// 近7天总流水柱状图配置
const initWeeklyChart = () => {
    if (!weeklyChartRef.value) return;
    
    const chart = echarts.init(weeklyChartRef.value);
    
    // 模拟7天数据
    const xData = ['11.21', '11.22', '11.23', '11.24', '11.25', '11.26', '11.27'];
    // 三组柱状图数据 - 根据设计稿调整数据
    const barData1 = [300, 850, 1000, 1700, 800, 350, 400]; // 蓝色柱
    const barData2 = [350, 900, 1050, 1650, 850, 400, 450]; // 橙色柱
    const barData3 = [280, 800, 950, 1500, 750, 300, 380]; // 黄色柱
    // 趋势线数据
    const lineData = [400, 1000, 1100, 1800, 900, 500, 400];
    
    const option = {
        title: {
            text: '总流水',
            left: 20,
            top: 15,
            textStyle: {
                fontSize: 16,
                fontWeight: 500,
                color: '#333'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#eee',
            borderWidth: 1,
            textStyle: {
                color: '#333'
            }
        },
        legend: {
            data: ['成交金额(元)'],
            right: 20,
            top: 15,
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 14,
            textStyle: {
                color: '#666',
                fontSize: 12
            }
        },
        grid: {
            left: 60,
            right: 40,
            top: 60,
            bottom: 35
        },
        xAxis: {
            type: 'category',
            data: xData,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#999',
                fontSize: 12
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 2000,
            interval: 500,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#999',
                fontSize: 12,
                formatter: '¥{value}'
            },
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            }
        },
        series: [
            // 蓝色柱
            {
                name: '成交金额(元)',
                type: 'bar',
                barWidth: 12,
                barGap: '30%',
                itemStyle: {
                    color: '#2979FF',
                    borderRadius: [2, 2, 0, 0]
                },
                data: barData1
            },
            // 橙色柱
            {
                type: 'bar',
                barWidth: 12,
                itemStyle: {
                    color: '#F5A623',
                    borderRadius: [2, 2, 0, 0]
                },
                data: barData2
            },
            // 黄色柱
            {
                type: 'bar',
                barWidth: 12,
                itemStyle: {
                    color: '#FFD54F',
                    borderRadius: [2, 2, 0, 0]
                },
                data: barData3
            },
            // 趋势线
            {
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: (value: number, params: { dataIndex: number }) => {
                    // 只在最后一个点显示大圆圈
                    return params.dataIndex === lineData.length - 1 ? 12 : 0;
                },
                showSymbol: true,
                lineStyle: {
                    width: 3,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: '#36D1DC' },
                        { offset: 0.5, color: '#5B86E5' },
                        { offset: 1, color: '#7B68EE' }
                    ])
                },
                itemStyle: {
                    color: '#fff',
                    borderColor: '#7B68EE',
                    borderWidth: 3
                },
                data: lineData,
                // 最后一个点的垂直标记线
                markLine: {
                    silent: true,
                    symbol: 'none',
                    lineStyle: {
                        color: '#7B68EE',
                        type: 'dashed',
                        width: 1
                    },
                    data: [
                        {
                            xAxis: '11.27',
                            label: { show: false }
                        }
                    ]
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    window.addEventListener('resize', () => {
        chart.resize();
    });
};

// 近7天AI风格饼图配置
const initWeeklyAiStyleChart = () => {
    if (!weeklyAiStyleChartRef.value) return;
    
    weeklyAiStyleChart = echarts.init(weeklyAiStyleChartRef.value);
    updateWeeklyAiStyleChart();
    
    window.addEventListener('resize', () => {
        weeklyAiStyleChart?.resize();
    });
};

const updateWeeklyAiStyleChart = () => {
    if (!weeklyAiStyleChart) return;
    
    const isCount = weeklyAiStyleTab.value === 'count';
    const data = isCount 
        ? [
            { value: 1200, name: '萌化贴纸' },
            { value: 1000, name: '人物转绘' },
            { value: 800, name: '萌版文旅' }
          ]
        : [
            { value: 1800, name: '萌化贴纸' },
            { value: 1400, name: '人物转绘' },
            { value: 1000, name: '萌版文旅' }
          ];
    
    const centerValue = isCount ? '3000个' : '¥4200';
    const percentage = '43%';
    
    const option = {
        color: ['#F5A623', '#F57C00', '#2979FF'],
        series: [
            // 外圈刻度装饰
            {
                type: 'gauge',
                center: ['50%', '50%'],
                radius: '90%',
                startAngle: 90,
                endAngle: -270,
                min: 0,
                max: 100,
                splitNumber: 40,
                pointer: { show: false },
                progress: { show: false },
                axisLine: {
                    lineStyle: {
                        width: 1,
                        color: [[1, 'transparent']]
                    }
                },
                axisTick: {
                    show: true,
                    splitNumber: 1,
                    length: 5,
                    distance: 0,
                    lineStyle: {
                        width: 1.5,
                        color: '#d0d0d0'
                    }
                },
                splitLine: { show: false },
                axisLabel: { show: false },
                detail: { show: false }
            },
            {
                type: 'pie',
                radius: ['45%', '68%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                padAngle: 2,
                itemStyle: {
                    borderRadius: 3
                },
                label: { show: false },
                emphasis: {
                    scale: true,
                    scaleSize: 4
                },
                labelLine: { show: false },
                data: data
            },
            {
                type: 'pie',
                radius: ['0%', '0%'],
                center: ['50%', '50%'],
                label: {
                    show: true,
                    position: 'center',
                    formatter: () => {
                        return `{value|${centerValue}}\n{percent|${percentage}}\n{name|名称名称}`;
                    },
                    rich: {
                        value: {
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#333',
                            lineHeight: 18
                        },
                        percent: {
                            fontSize: 12,
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            color: '#666',
                            lineHeight: 16
                        },
                        name: {
                            fontSize: 10,
                            color: '#999',
                            lineHeight: 14
                        }
                    }
                },
                data: [{ value: 0, name: '' }]
            }
        ]
    };
    
    weeklyAiStyleChart.setOption(option);
};

watch(weeklyAiStyleTab, () => {
    updateWeeklyAiStyleChart();
});

onMounted(() => {
    initRealtimeChart();
    initAiStyleChart();
    initWeeklyChart();
    initWeeklyAiStyleChart();
});
</script>

<style scoped>
.page-wrapper {
    display: flex;
    gap: 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
}

/* 左侧主内容区 */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* 顶部账户信息栏 */
.account-header {
    display: flex;
    align-items: center;
    padding: 36px 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.account-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #f5a623, #e6941b);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    flex-shrink: 0;
}

.account-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.account-info .label {
    font-size: 13px;
    color: #666;
}

.account-info .amount-row {
    display: flex;
    align-items: baseline;
    gap: 16px;
}

.account-info .amount {
    font-size: 28px;
    font-weight: 600;
    color: #e6941b;
    letter-spacing: -0.5px;
}

.account-info .link {
    font-size: 13px;
    color: #e6941b;
    cursor: pointer;
}

.account-info .link:hover {
    text-decoration: underline;
}

.account-actions {
    display: flex;
    gap: 12px;
    margin-left: auto;
}

.account-actions .btn-primary {
    padding: 8px 24px;
    background: linear-gradient(135deg, #f5a623, #e6941b);
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: opacity 0.2s;
}

.account-actions .btn-primary:hover {
    opacity: 0.9;
}

.account-actions .btn-outline {
    padding: 8px 24px;
    background: #fff;
    color: #333;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: border-color 0.2s;
}

.account-actions .btn-outline:hover {
    border-color: #c0c4cc;
}

/* 通用区块样式 */
.section {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.section-title {
    font-size: 16px;
    font-weight: bold;
}

.update-time {
    font-size: 12px;
    color: #999;
}

/* 实时营收和近7天营收的内容布局 */
.realtime-revenue .section-body,
.weekly-revenue .section-body {
    display: flex;
    gap: 20px;
}

/* 成交金额卡片 */
.stat-card {
    position: relative;
    width: 160px;
    height: 200px;
    padding: 16px;
    background: linear-gradient(180deg, #fdf6e3 0%, #f5edd8 100%);
    border-radius: 12px;
    flex-shrink: 0;
    overflow: hidden;
    box-sizing: border-box;
}

.stat-card-decoration {
    position: absolute;
    top: 10px;
    right: 10px;
    opacity: 0.6;
}

.stat-card-icon {
    width: 36px;
    height: 36px;
    background: #1a1a1a;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
}

.stat-card-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #8b7355;
    margin-bottom: 8px;
}

.stat-card-title .help-icon {
    cursor: pointer;
}

.stat-card-value {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    letter-spacing: -1px;
    margin-bottom: 12px;
}

.stat-card-divider {
    height: 1px;
    background: linear-gradient(90deg, #d4c4a0 0%, transparent 100%);
    margin-bottom: 10px;
}

.stat-card-footer {
    display: flex;
    align-items: center;
}

.stat-card-footer .dot {
    width: 6px;
    height: 6px;
    background: #1a1a1a;
    border-radius: 50%;
    margin-right: 8px;
}

.stat-card-footer .label {
    font-size: 14px;
    color: #1a1a1a;
    flex: 1;
}

.stat-card-footer .count {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
}

/* 折线图/柱状图区域 */
.chart-area {
    flex: 1;
    min-height: 200px;
    border: 1px dashed #ddd;
    border-radius: 8px;
    padding: 15px;
}

.chart-area.realtime-chart {
    border: none;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    height: 200px;
    min-height: 200px;
    box-sizing: border-box;
}

.chart-area.weekly-chart {
    border: none;
    background: #fff;
    padding: 0;
    height: 260px;
    min-height: 260px;
}

.chart-container {
    flex: 1;
    min-height: 0;
}

.chart-container-full {
    width: 100%;
    height: 100%;
}

/* 饼图区域 */
.pie-chart-area {
    width: 250px;
    min-height: 200px;
    border: 1px dashed #ddd;
    border-radius: 8px;
    padding: 15px;
    flex-shrink: 0;
}

.pie-chart-area.weekly-pie-chart {
    width: 280px;
    height: 180px;
    min-height: 180px;
    border: none;
    background: #fafafa;
    padding: 12px 16px;
    box-sizing: border-box;
}

.pie-chart-area.weekly-pie-chart .ai-style-content {
    height: 120px;
    gap: 8px;
}

.pie-chart-area.weekly-pie-chart .ai-pie-container {
    width: 170px;
    height: 220px;
    margin-top: 50px;
}

/* AI风格饼图区域 */
.pie-chart-area.ai-style-chart {
    width: 280px;
    min-height: 180px;
    border: none;
    background: #fafafa;
    padding: 12px 16px;
    box-sizing: border-box;
}

.ai-style-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.ai-style-header .chart-title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 0;
}

.tab-switch-btns {
    display: flex;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
}

.tab-switch-btns .tab-btn {
    padding: 6px 20px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
    background: #fff;
}

.tab-switch-btns .tab-btn:first-child {
    border-right: 1px solid #e0e0e0;
}

.tab-switch-btns .tab-btn.active {
    color: #F5A623;
    border: 2px solid #F5A623;
    margin: -1px;
    border-radius: 4px;
    background: #fff;
}

.ai-style-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    height: 130px;
}

.ai-pie-container {
    width: 130px;
    height: 130px;
    flex-shrink: 0;
}

.ai-style-legend {
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: center;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    flex-shrink: 0;
}

.legend-text {
    font-size: 14px;
    color: #333;
    white-space: nowrap;
}

.chart-title {
    font-size: 14px;
    margin-bottom: 10px;
}

.tab-switch {
    font-size: 12px;
    color: #666;
    margin-bottom: 10px;
}

.chart-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;
    color: #999;
}

/* 表格区块 */
.revenue-table .section-header {
    border-bottom: none;
    padding-bottom: 15px;
    margin-bottom: 0;
}

.revenue-table .section-title {
    position: relative;
    padding-left: 10px;
}

.revenue-table .section-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 16px;
    background: #F5A623;
    border-radius: 2px;
}

.table-actions {
    display: flex;
    align-items: center;
    gap: 0;
}

.table-actions span {
    padding: 6px 16px;
    font-size: 13px;
    color: #666;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    background: #fff;
    transition: all 0.2s;
}

.table-actions span:first-child {
    border-radius: 4px 0 0 4px;
}

.table-actions span:nth-child(3) {
    border-radius: 0 4px 4px 0;
    border-left: none;
}

.table-actions span:nth-child(2) {
    border-left: none;
    border-right: none;
}

.table-actions span.active {
    color: #F5A623;
    border-color: #F5A623;
    background: #fff;
    position: relative;
    z-index: 1;
}

.table-actions span:not(:first-child):not(.active) {
    margin-left: -1px;
}

.export-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-left: 12px;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: pointer;
    color: #666;
    transition: all 0.2s;
}

.export-btn:hover {
    border-color: #F5A623;
    color: #F5A623;
}

/* 数据表格 */
.revenue-data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    table-layout: fixed;
}

.revenue-data-table thead {
    background: #fafafa;
}

.revenue-data-table th {
    padding: 14px 12px;
    text-align: center;
    font-weight: 400;
    color: #666;
    border-bottom: 1px solid #eee;
    white-space: nowrap;
}

.revenue-data-table th:first-child {
    text-align: left;
    padding-left: 20px;
}

.revenue-data-table th.sortable {
    cursor: pointer;
    user-select: none;
}

.revenue-data-table th.sortable:hover {
    color: #333;
}

.revenue-data-table th .sort-icon {
    vertical-align: middle;
    margin-left: 2px;
}

.revenue-data-table td {
    padding: 18px 12px;
    color: #333;
    border-bottom: 1px solid #f5f5f5;
    text-align: center;
}

.revenue-data-table td:first-child {
    text-align: left;
    padding-left: 20px;
}

.revenue-data-table tbody tr:hover {
    background: #fafafa;
}

.revenue-data-table td.col-device {
    display: flex;
    align-items: center;
    gap: 8px;
}

.device-indicator {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    flex-shrink: 0;
}

.revenue-data-table .col-amount {
    text-align: center;
}

/* 右侧排行榜侧边栏 */
.sidebar {
    width: 300px;
    flex-shrink: 0;
}

.ranking-card {
    background: linear-gradient(180deg, #FFF8E1 0%, #FFF3CD 50%, #FFFDF5 100%);
    border-radius: 16px;
    padding: 20px 16px;
    box-shadow: 0 4px 20px rgba(245, 166, 35, 0.15);
}

.ranking-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: 18px;
    font-weight: bold;
    color: #F5A623;
    margin-bottom: 20px;
}

.ranking-header .header-arrow {
    opacity: 0.8;
}

.ranking-summary {
    background: #fff;
    border-radius: 12px;
    padding: 24px 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.ranking-amount {
    text-align: center;
    margin-bottom: 20px;
}

.ranking-amount .label {
    display: block;
    font-size: 14px;
    color: #F5A623;
    margin-bottom: 8px;
}

.ranking-amount .value {
    display: block;
    font-size: 36px;
    font-weight: bold;
    color: #F5A623;
    letter-spacing: -1px;
}

.ranking-stats {
    display: flex;
    justify-content: space-around;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
}

.ranking-stats .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.ranking-stats .stat-label {
    font-size: 13px;
    color: #999;
}

.ranking-stats .stat-value {
    font-size: 20px;
    font-weight: 600;
    color: #333;
}

.ranking-list {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.ranking-item {
    display: flex;
    align-items: center;
    padding: 16px 14px;
    background: #fff;
    border-radius: 10px;
    margin-bottom: 10px;
}

.ranking-item.top {
    background: linear-gradient(90deg, #FFF9E6 0%, #FFFDF8 100%);
    border: none;
    box-shadow: 0 1px 4px rgba(245, 166, 35, 0.1);
}

.ranking-item .rank {
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 14px;
    font-size: 15px;
    font-weight: 500;
    color: #999;
}

.ranking-item .rank-icon {
    position: relative;
    width: 26px;
    height: 26px;
    margin-right: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ranking-item .rank-icon .rank-num {
    position: absolute;
    font-size: 11px;
    font-weight: bold;
    color: #fff;
    bottom: 2px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.ranking-item .name {
    flex: 1;
    font-size: 14px;
    color: #333;
    font-weight: 400;
}

.ranking-item .amount {
    font-size: 15px;
    font-weight: 500;
    color: #333;
}

.ranking-item .amount.highlight {
    color: #F5A623;
    font-weight: 600;
}

.ranking-item .amount .unit {
    font-size: 13px;
    font-weight: normal;
    color: #999;
    margin-left: 3px;
}
</style>

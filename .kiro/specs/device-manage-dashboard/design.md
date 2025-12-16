# Design Document

## Overview

本设计文档描述设备管理页面左侧"设备概况"面板组件的技术实现方案。该组件将作为 `device-manage.vue` 页面的一部分，使用 Vue 3 Composition API、Element Plus UI 框架和 ECharts 图表库实现。

## Architecture

组件采用单文件组件（SFC）架构，直接集成到现有的 `device-manage.vue` 文件中。

```
device-manage.vue
├── Device Overview Panel (左侧面板)
│   ├── Panel Header (标题区域)
│   ├── Statistics Section (统计区域)
│   │   ├── Donut Chart (ECharts 环形图)
│   │   └── Total Count Display
│   ├── Fault Warning Card (故障警告卡片)
│   │   └── Status Items Grid (2x2)
│   └── Maintenance Card (更换维护卡片)
│       └── Status Items Row (1x3)
└── Device Status Table (右侧表格 - 现有)
```

## Components and Interfaces

### 1. Device Overview Panel

主容器组件，包含所有子组件。

```typescript
// 面板数据接口
interface DeviceOverviewData {
  totalDevices: number;      // 总设备数
  faultCount: number;        // 故障维护数
  normalCount: number;       // 正常运行数
}
```

### 2. Donut Chart Component

使用 ECharts 实现的环形图组件。

```typescript
// 图表配置
interface ChartConfig {
  faultColor: string;    // '#FF9500' 橙色
  normalColor: string;   // '#409EFF' 蓝色
  centerText: string;    // 中心文字
  centerValue: number;   // 中心数值
}
```

### 3. Status Card Components

故障警告和更换维护卡片。

```typescript
// 状态项接口
interface StatusItem {
  label: string;   // 标签名称
  count: number;   // 数量
}

// 故障警告数据
interface FaultWarningData {
  items: StatusItem[];  // 故障项列表
}

// 更换维护数据
interface MaintenanceData {
  items: StatusItem[];  // 维护项列表
}
```

## Data Models

### Static Data Structure

```typescript
// 设备概况静态数据
const overviewData = reactive({
  // 总览数据
  summary: {
    totalDevices: 14,
    faultCount: 5,
    normalCount: 14
  },
  
  // 故障警告数据
  faultWarning: [
    { label: '摄像头', count: 2 },
    { label: '膜切机', count: 2 },
    { label: '摄像头', count: 2 },
    { label: '打印机', count: 2 },
    { label: '网络信号', count: 2 }
  ],
  
  // 更换维护数据
  maintenance: [
    { label: '刀头', count: 2 },
    { label: '纸张', count: 2 },
    { label: '色带', count: 2 }
  ]
});
```

### ECharts Configuration

```typescript
// 环形图配置
const chartOption = {
  series: [{
    type: 'pie',
    radius: ['60%', '80%'],
    center: ['50%', '50%'],
    data: [
      { value: 5, name: '故障维护', itemStyle: { color: '#FF9500' } },
      { value: 14, name: '运行正常', itemStyle: { color: '#409EFF' } }
    ],
    label: { show: false },
    emphasis: { scale: false }
  }]
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

由于本组件主要是静态数据展示的UI组件，涉及的是视觉渲染而非复杂业务逻辑，因此没有可通过属性测试验证的正确性属性。所有验收标准都涉及UI渲染和视觉呈现，这些需要通过视觉检查或E2E测试来验证。

## Error Handling

### Chart Rendering Errors

```typescript
// ECharts 初始化错误处理
const initChart = () => {
  try {
    const chartDom = document.getElementById('donut-chart');
    if (!chartDom) {
      console.warn('Chart container not found');
      return;
    }
    const chart = echarts.init(chartDom);
    chart.setOption(chartOption);
  } catch (error) {
    console.error('Failed to initialize chart:', error);
  }
};
```

### Data Validation

```typescript
// 数据有效性检查
const validateData = (data: DeviceOverviewData): boolean => {
  return data.totalDevices >= 0 && 
         data.faultCount >= 0 && 
         data.normalCount >= 0;
};
```

## Testing Strategy

### Unit Testing

由于组件主要是静态数据展示，单元测试将聚焦于：

1. **数据结构验证** - 确保静态数据符合接口定义
2. **计算属性测试** - 验证图表配置生成逻辑

### Visual Testing

1. **组件渲染测试** - 验证组件正确挂载
2. **样式一致性** - 确保与UI设计图一致

### Property-Based Testing

本组件为纯展示型UI组件，使用静态数据，不涉及复杂的业务逻辑转换或数据处理，因此不适用属性测试。

## Visual Design Specifications

### Colors

| 元素 | 颜色值 |
|------|--------|
| 故障/橙色 | #FF9500 |
| 正常/蓝色 | #409EFF |
| 警告图标背景 | #FFF0F0 |
| 维护图标背景 | #F0FFF4 |
| 标题左边框 | #409EFF |
| 文字主色 | #333333 |
| 文字次色 | #999999 |

### Layout

| 元素 | 尺寸 |
|------|------|
| 面板宽度 | 280px |
| 环形图尺寸 | 100px x 100px |
| 卡片间距 | 20px |
| 内边距 | 20px |

### Typography

| 元素 | 字号 | 字重 |
|------|------|------|
| 面板标题 | 16px | 600 |
| 数值大字 | 24px | 700 |
| 标签文字 | 12px | 400 |
| 图例文字 | 12px | 400 |

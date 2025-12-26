# Design Document: Revenue Table Dynamic Header

## Overview

本设计文档描述了营收流水页面中实时营收表格的动态表头功能实现方案。该功能使表格的"总流水"列表头能够根据用户选择的时间范围（昨天、近7天、近30天）动态更新显示文本。

## Architecture

该功能采用 Vue 3 Composition API 的响应式设计模式：

```
┌─────────────────────────────────────────────────────────┐
│                  revenue-flow.vue                        │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────────────┐    │
│  │ tableTimeRange  │───▶│ totalFlowHeaderLabel    │    │
│  │ (ref: string)   │    │ (computed: string)      │    │
│  └─────────────────┘    └───────────┬─────────────┘    │
│                                     │                   │
│                                     ▼                   │
│                         ┌─────────────────────────┐    │
│                         │   Table Header (th)     │    │
│                         │   {{ headerLabel }}     │    │
│                         └─────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. 时间范围映射配置

```typescript
// 时间范围类型定义
type TimeRange = 'yesterday' | 'week' | 'month';

// 时间范围与表头标签的映射
const timeRangeHeaderMap: Record<TimeRange, string> = {
    yesterday: '昨日总流水(元)',
    week: '近7天总流水(元)',
    month: '近30天总流水(元)'
};
```

### 2. 计算属性接口

```typescript
// 动态表头标签计算属性
const totalFlowHeaderLabel = computed<string>(() => {
    return timeRangeHeaderMap[tableTimeRange.value] || '总流水(元)';
});
```

### 3. 模板绑定

```html
<th class="col-amount sortable">
    {{ totalFlowHeaderLabel }}
    <svg class="sort-icon" ...>...</svg>
</th>
```

## Data Models

### TimeRangeHeaderConfig

| 字段 | 类型 | 描述 |
|------|------|------|
| yesterday | string | "昨天"选项对应的表头文本 |
| week | string | "近7天"选项对应的表头文本 |
| month | string | "近30天"选项对应的表头文本 |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Time Range to Header Label Mapping Consistency

*For any* valid time range value (yesterday, week, month), the `totalFlowHeaderLabel` computed property should return the corresponding header label text that matches the expected mapping.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

具体映射关系：
- `yesterday` → `昨日总流水(元)`
- `week` → `近7天总流水(元)`
- `month` → `近30天总流水(元)`

## Error Handling

1. **无效时间范围值**: 如果 `tableTimeRange` 包含未定义的值，计算属性将返回默认值 `'总流水(元)'`
2. **类型安全**: 使用 TypeScript 类型定义确保只能传入有效的时间范围值

## Testing Strategy

### 单元测试

由于该功能逻辑简单，主要通过以下方式验证：

1. **映射函数测试**: 验证 `timeRangeHeaderMap` 对象包含所有预期的键值对
2. **计算属性测试**: 验证 `totalFlowHeaderLabel` 在不同 `tableTimeRange` 值下返回正确的标签

### 属性测试

使用 Vitest 的属性测试功能（通过 fast-check 库）验证：

- **Property 1**: 对于所有有效的时间范围输入，映射函数应返回非空字符串且包含"总流水"关键词

测试配置：
- 属性测试库: fast-check (与 Vitest 集成)
- 最小迭代次数: 100 次
- 测试文件位置: `src/views/business/__tests__/revenue-flow.spec.ts`

测试标注格式：
```typescript
// **Feature: revenue-table-dynamic-header, Property 1: Time Range to Header Label Mapping Consistency**
```

# Requirements Document

## Introduction

本功能旨在优化营收流水页面的实时营收表格区块，使表头中的时间范围描述能够根据用户选择的时间筛选条件（昨天、近7天、近30天）动态更新，提升用户体验和数据展示的准确性。

## Glossary

- **Revenue_Flow_Page**: 营收流水页面，展示设备营收数据的主要页面
- **Time_Range_Selector**: 时间范围选择器，包含"昨天"、"近7天"、"近30天"三个选项
- **Revenue_Table**: 实时营收表格，展示各设备的营收流水数据
- **Table_Header**: 表格表头，包含列标题如"设备名称"、"总流水(元)"等
- **Dynamic_Header_Label**: 动态表头标签，根据选中时间范围变化的表头文本

## Requirements

### Requirement 1

**User Story:** 作为用户，我希望表格表头能够根据我选择的时间范围动态显示对应的标签，以便我能清楚地知道当前查看的是哪个时间段的数据。

#### Acceptance Criteria

1. WHEN 用户点击"昨天"按钮 THEN Revenue_Table SHALL 将总流水列表头更新为"昨日总流水(元)"
2. WHEN 用户点击"近7天"按钮 THEN Revenue_Table SHALL 将总流水列表头更新为"近7天总流水(元)"
3. WHEN 用户点击"近30天"按钮 THEN Revenue_Table SHALL 将总流水列表头更新为"近30天总流水(元)"
4. WHEN 页面初始加载且默认选中"近7天" THEN Revenue_Table SHALL 显示"近7天总流水(元)"作为初始表头

### Requirement 2

**User Story:** 作为用户，我希望时间范围切换时表头更新是即时的，以便我能获得流畅的交互体验。

#### Acceptance Criteria

1. WHEN 用户切换时间范围选项 THEN Revenue_Table SHALL 在100毫秒内完成表头文本更新
2. WHEN 表头文本更新时 THEN Revenue_Table SHALL 保持表格布局稳定，列宽不发生变化

### Requirement 3

**User Story:** 作为开发者，我希望时间范围与表头标签的映射关系是可维护的，以便未来可以方便地添加新的时间范围选项。

#### Acceptance Criteria

1. WHEN 定义时间范围映射 THEN Revenue_Flow_Page SHALL 使用计算属性或映射对象来管理时间范围与表头标签的对应关系
2. WHEN 添加新的时间范围选项 THEN Revenue_Flow_Page SHALL 仅需在映射配置中添加新条目即可支持新选项

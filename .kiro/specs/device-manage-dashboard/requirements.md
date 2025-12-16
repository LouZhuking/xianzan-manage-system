# Requirements Document

## Introduction

本文档定义了设备管理页面左侧"设备概况"面板组件的需求。该组件用于展示设备的整体运行状态概览，包括总设备量统计、故障警告信息和更换维护提醒，帮助用户快速了解设备健康状况。

## Glossary

- **Device_Overview_Panel**: 设备概况面板，显示设备统计信息的左侧卡片组件
- **Donut_Chart**: 环形图，用于可视化展示故障维护与正常运行设备的比例
- **Fault_Warning_Card**: 故障警告卡片，显示各类设备的故障数量
- **Maintenance_Card**: 更换维护卡片，显示需要更换维护的耗材数量
- **Status_Item**: 状态项，单个设备类型或耗材的状态显示单元

## Requirements

### Requirement 1

**User Story:** As a 设备管理员, I want to 查看设备总量和运行状态分布, so that I can 快速了解整体设备健康状况。

#### Acceptance Criteria

1. WHEN the Device_Overview_Panel loads THEN the Device_Overview_Panel SHALL display a Donut_Chart showing the ratio of faulty devices to normally running devices
2. WHEN the Device_Overview_Panel loads THEN the Device_Overview_Panel SHALL display the total device count as "14个" with label "总设备量"
3. WHEN the Device_Overview_Panel loads THEN the Device_Overview_Panel SHALL display the fault maintenance count "5" in the center of the Donut_Chart with label "故障维护"
4. WHEN the Device_Overview_Panel loads THEN the Device_Overview_Panel SHALL display a legend showing "故障维护 5个" in orange and "运行正常 14个" in blue

### Requirement 2

**User Story:** As a 设备管理员, I want to 查看故障警告详情, so that I can 了解哪些设备类型出现故障需要关注。

#### Acceptance Criteria

1. WHEN the Fault_Warning_Card renders THEN the Fault_Warning_Card SHALL display a red warning icon on the right side
2. WHEN the Fault_Warning_Card renders THEN the Fault_Warning_Card SHALL display four Status_Items in a 2x2 grid layout
3. WHEN the Fault_Warning_Card renders THEN the Fault_Warning_Card SHALL show "摄像头" with count "2", "膜切机" with count "2", "摄像头" with count "2", "打印机" with count "2", and "网络信号" with count "2"
4. WHEN the Fault_Warning_Card renders THEN each Status_Item SHALL display the count in bold large font above the label text

### Requirement 3

**User Story:** As a 设备管理员, I want to 查看更换维护提醒, so that I can 及时安排耗材更换和设备维护。

#### Acceptance Criteria

1. WHEN the Maintenance_Card renders THEN the Maintenance_Card SHALL display a green maintenance icon on the right side
2. WHEN the Maintenance_Card renders THEN the Maintenance_Card SHALL display three Status_Items in a row layout
3. WHEN the Maintenance_Card renders THEN the Maintenance_Card SHALL show "刀头" with count "2", "纸张" with count "2", and "色带" with count "2"
4. WHEN the Maintenance_Card renders THEN each Status_Item SHALL display the count in bold large font above the label text

### Requirement 4

**User Story:** As a 用户, I want to 看到清晰的视觉层次结构, so that I can 快速区分不同类型的信息。

#### Acceptance Criteria

1. WHEN the Device_Overview_Panel renders THEN the Device_Overview_Panel SHALL have a white background with subtle shadow
2. WHEN the Device_Overview_Panel renders THEN each card section SHALL be visually separated with appropriate spacing
3. WHEN the Device_Overview_Panel renders THEN the panel title "设备概况" SHALL be displayed at the top with a left border accent
4. WHEN the Donut_Chart renders THEN the chart SHALL use orange color (#FF9500) for fault portion and blue color (#409EFF) for normal portion

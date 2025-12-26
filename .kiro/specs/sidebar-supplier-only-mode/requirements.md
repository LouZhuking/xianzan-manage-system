# Requirements Document

## Introduction

本功能实现管理员视图下，根据当前页面路由动态调整左侧导航栏的显示模式。当管理员访问"营收流水"和"订单系统"页面时，左侧导航栏只显示供应商列表，不展开显示具体的设备号；而在其他页面（如设备管理）则保持原有的供应商+设备二级导航模式。

## Glossary

- **Sidebar（侧边栏）**: 页面左侧的导航组件，用于显示供应商和设备列表
- **Admin（管理员）**: roleId为1的用户，拥有查看所有供应商和设备的权限
- **Supplier（供应商）**: 经销商/代理商，拥有多个设备
- **Device（设备）**: 具体的终端设备，隶属于某个供应商
- **Supplier-Only Mode（仅供应商模式）**: 侧边栏只显示供应商列表，不显示设备子项的显示模式
- **Full Navigation Mode（完整导航模式）**: 侧边栏显示供应商及其下属设备的二级导航模式

## Requirements

### Requirement 1

**User Story:** As an administrator, I want the sidebar to show only supplier names without device details when I visit the Revenue Flow or Order System pages, so that I can focus on supplier-level data without device-level distractions.

#### Acceptance Criteria

1. WHEN an administrator navigates to the Revenue Flow page (route: /revenue-flow) THEN the Sidebar SHALL display only the supplier list without device sub-items
2. WHEN an administrator navigates to the Order System page (route: /order-system) THEN the Sidebar SHALL display only the supplier list without device sub-items
3. WHEN an administrator navigates to other pages (e.g., /device-manage) THEN the Sidebar SHALL display the full two-level navigation with suppliers and their devices
4. WHEN the Sidebar is in supplier-only mode THEN the Sidebar SHALL hide the expand/collapse arrow icons for supplier items
5. WHEN the Sidebar is in supplier-only mode THEN the Sidebar SHALL maintain the supplier overview item at the top of the list

### Requirement 2

**User Story:** As an administrator, I want to click on a supplier in supplier-only mode to select it and view its data, so that I can analyze revenue or orders for that specific supplier.

#### Acceptance Criteria

1. WHEN an administrator clicks on a supplier item in supplier-only mode THEN the Sidebar SHALL mark that supplier as active with visual highlighting
2. WHEN an administrator clicks on a supplier item in supplier-only mode THEN the Sidebar SHALL update the current supplier context for the main content area
3. WHEN an administrator clicks on a supplier item in supplier-only mode THEN the Sidebar SHALL NOT expand to show device sub-items

### Requirement 3

**User Story:** As an administrator, I want the sidebar to automatically switch display modes when I navigate between pages, so that I always see the appropriate navigation structure for each page.

#### Acceptance Criteria

1. WHEN an administrator navigates from a supplier-only page to a full navigation page THEN the Sidebar SHALL automatically switch to full navigation mode
2. WHEN an administrator navigates from a full navigation page to a supplier-only page THEN the Sidebar SHALL automatically switch to supplier-only mode and collapse any expanded suppliers
3. WHEN the display mode changes THEN the Sidebar SHALL preserve the currently selected supplier if applicable

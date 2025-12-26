# Implementation Plan

- [x] 1. 实现动态表头标签功能

  - [x] 1.1 添加时间范围与表头标签的映射配置


    - 在 `revenue-flow.vue` 的 script 部分添加 `timeRangeHeaderMap` 常量对象
    - 定义 `yesterday`、`week`、`month` 三个键对应的中文标签


    - _Requirements: 3.1, 3.2_
  - [ ] 1.2 创建计算属性 `totalFlowHeaderLabel`
    - 使用 Vue 3 的 `computed` 函数创建响应式计算属性


    - 根据 `tableTimeRange.value` 从映射对象中获取对应的表头文本
    - 添加默认值处理，防止未定义的时间范围值
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [ ] 1.3 更新模板中的表头绑定
    - 将表格中硬编码的 "近7天总流水(元)" 替换为 `{{ totalFlowHeaderLabel }}`
    - 确保排序图标保持不变
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.2_
  - [ ]* 1.4 编写属性测试验证映射一致性
    - **Property 1: Time Range to Header Label Mapping Consistency**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
    - 创建测试文件 `src/views/business/__tests__/revenue-flow.spec.ts`
    - 使用 fast-check 验证所有有效时间范围值都能返回正确的表头标签

- [ ] 2. Checkpoint - 确保所有测试通过
  - Ensure all tests pass, ask the user if questions arise.

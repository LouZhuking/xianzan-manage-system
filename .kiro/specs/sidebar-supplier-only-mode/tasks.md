# Implementation Plan

- [x] 1. Update Sidebar Store with collapse action




  - [ ] 1.1 Add collapseAllSuppliers action to sidebar store
    - Add new action to collapse all expanded suppliers




    - Clear expandedSuppliers array and update sessionStorage
    - _Requirements: 3.2_

- [ ] 2. Implement supplier-only mode logic in Sidebar component
  - [ ] 2.1 Add route detection and mode computation
    - Import useRoute from vue-router
    - Define supplierOnlyRoutes constant array


    - Add isSupplierOnlyMode computed property
    - _Requirements: 1.1, 1.2, 1.3_
  - [x]* 2.2 Write property test for mode detection


    - **Property 1: Supplier-only mode activation**
    - **Property 2: Full navigation mode for other routes**
    - **Validates: Requirements 1.1, 1.2, 1.3**
  - [ ] 2.3 Update template to conditionally render based on mode
    - Hide expand/collapse arrows in supplier-only mode




    - Hide device children section in supplier-only mode
    - Keep supplier overview item visible in both modes
    - _Requirements: 1.4, 1.5_
  - [ ] 2.4 Modify supplier click handler for supplier-only mode
    - In supplier-only mode: only select supplier, do not toggle expand
    - In full navigation mode: keep existing behavior (toggle expand + select)
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 2.5 Write property test for supplier click behavior
    - **Property 3: Supplier click in supplier-only mode**
    - **Validates: Requirements 2.1, 2.2, 2.3**

- [ ] 3. Implement automatic mode transition handling
  - [ ] 3.1 Add route watcher for mode transitions
    - Watch route changes
    - Collapse all suppliers when entering supplier-only mode
    - Preserve active supplier selection during transitions
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]* 3.2 Write property test for mode transitions
    - **Property 4: Mode transition collapses suppliers**
    - **Property 5: Active supplier preservation**
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [ ] 4. Final Checkpoint - Verify implementation
  - Ensure all tests pass, ask the user if questions arise.

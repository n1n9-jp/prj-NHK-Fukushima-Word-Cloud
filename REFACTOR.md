# Refactoring Plan

This document outlines the refactoring progress and future plans for the `prj-NHK-Fukushima-Word-Cloud` project.

## Phase 1: Modularization & Bug Fixes (Completed)
- [x] **Separated Logic into Classes**: 
    - `Eventer.js`: Pub/Sub event handling.
    - `Config.js`: Constant definitions (Viewport, Dimensions).
    - `DataLoader.js`: Data fetching logic.
    - `WordCloud.js`: D3 visualization logic.
    - `Modal.js`: Modal dialog logic (ZMODAL).
- [x] **Fixed Critical Bugs**:
    - `SyntaxError` in `app.js`.
    - `nowWidth`/`nowHeight` reference errors.
    - Modal closing not restoring word cloud correctly.
    - Word color reset logic fix ("Whole" vs others).
    - **Clicked word color**: Fixed to ensure clicked word appears white in all views.
- [x] **Improved Code Structure**:
    - Converted `app.js` to ES Module.
    - Removed global functions where possible.

## Phase 2: Logic Separation & UI/Data Management (Completed)
- [x] **UI Logic Separation (`UIManager.js`)**:
    - Extracted navigation menu creation.
    - Extracted container visibility toggling.
    - Extracted "About" link and Mobile dialog logic.
- [x] **Data Management (`DataStore.js`)**:
    - Centralized data storage (`tags`, `allOpenText`, `detailWordsArray`).
    - Implemented logic to search for word details (`findDetails`).
- [x] **Presentation Separation (`DetailView.js`)**:
    - Extracted HTML generation logic for the detail modal.
    - Cleaned up `showDetail` in `app.js`.

## Phase 3: Future Refactoring Items (Pending)

### 1. State Management Separation (`StateManager.js`)
Currently, state variables (`currentNum`, `prevNum`, `vidId`, `selectedWord`) are loosely managed in `app.js`.
- **Goal**: Create a `StateManager` class to encapsulation application state.
- **Benefits**: 
    - Centralized state updates.
    - Better reactivity (State change -> Event -> UI Update).
    - Removes dependence on closure variables in `app.js`.

### 2. Modernize Variable Declarations & Syntax
`app.js` still contains legacy `var` declarations and jQuery-style variable definitions.
- **Goal**: Replace all `var` with `const`/`let`.
- **Goal**: Convert remaining function expressions to arrow functions where appropriate.
- **Goal**: Reduce direct jQuery dependency where standard DOM API suffices.

### 3. Logic Cleanup & Component Separation
- **Start Button**: The "Start" button logic is currently inside `app.js`'s `drawWhole`. It should be moved to `WordCloud.js` or a separate component.
- **D3 Versioning**: The project uses D3 v3. Future consideration for upgrading to D3 v7+ (requires significant rewrite of `d3.layout.cloud` usage and selection logic).

### 4. Application Flow Optimization
- **Goal**: Unify the event flow. Currently, `app.js` coordinates events between `WordCloud` and `UIManager`. Implementing a stricter Data -> State -> View flow would improve maintainability.

---
**Note**: The application is currently fully functional with Phase 1 & 2 improvements. Phase 3 items are architectural improvements for long-term maintainability.

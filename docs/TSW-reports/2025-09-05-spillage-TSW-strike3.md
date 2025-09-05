# TSW Analysis Report: Layout Spillage Issue - Strike 3
**Date:** September 5, 2025  
**Issue:** Featured Products and Story sections extending beyond page margins  
**Status:** Strike 3 - Failed, but gap restored  

## TSW Framework Analysis

### 1. Hardware Capabilities
- **Viewport Constraints:** Desktop browsers with various screen sizes
- **Rendering Engine:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **Display Resolution:** Multiple resolutions from 1024px to 4K+
- **Hardware Acceleration:** CSS transforms and animations supported

### 2. OS Limitations
- **Browser Rendering:** Different browsers handle CSS box model differently
- **Viewport Units:** `100vw` can cause horizontal scrollbars on some systems
- **CSS Grid/Flexbox:** Consistent behavior across modern browsers
- **Overflow Handling:** Browser-specific overflow behavior

### 3. Application Purpose
- **Primary Goal:** Display DarkStreets homepage with navigation buttons and content sections
- **Content Sections:** Featured Products (yellow gradient) and Story (brown gradient)
- **Layout Requirements:** Sections must stay within viewport boundaries
- **Responsive Design:** Must work across all screen sizes

### 4. Sub-routine Hierarchy
```
main (max-w-6xl mx-auto)
├── Hero Section (banner)
├── Navigation Grid (4 buttons)
├── Featured Products Section (bg-gradient-to-b from-[#EFD907] to-[#B8A005])
│   └── Grid with 3 columns (Books, Apparel, Experiences)
└── Story Section (bg-gradient-to-b from-[#8B4513] to-swatch105)
    ├── Text content
    ├── Tiger image (absolute positioned)
    └── Dancer image (absolute positioned)
```

### 5. Temporal Effects
- **CSS Cascade:** Multiple CSS rules affecting layout
- **Box Model:** Padding, margins, borders affecting total width
- **Absolute Positioning:** Tiger/Dancer images positioned outside normal flow
- **Grid System:** CSS Grid creating layout constraints

## Strike 3 Implementation (Failed - Gap Restored)

### Changes Made:
1. **Reverted Strike 2:** Restored `max-w-6xl mx-auto` main container
2. **Restored Gap:** Kept `mb-16` between Featured and Story sections
3. **Restored Padding:** Kept `p-6` for proper visual spacing
4. **Constrained Images:** Reduced Tiger/Dancer from `w-[100px]` to `w-[80px]`
5. **Better Positioning:** Used `inset-x-2` with explicit `left`/`right` styles
6. **CSS Containment:** Added `contain: layout` and `contain: strict`
7. **Reduced Borders:** Changed from `border-6` to `border-4`

### Outcome:
- ❌ **Spillage persists:** Horizontal scrollbar still present
- ✅ **Gap restored:** Proper spacing between Featured and Story sections
- ✅ **Images contained:** Tiger/Dancer images more constrained
- ✅ **Visual hierarchy preserved:** Padding and spacing maintained

### Root Cause Analysis:
The spillage issue appears to be deeper than container constraints. Possible causes:
1. **CSS Box Model:** Padding + border + content exceeding container width
2. **Viewport Units:** `100vw` calculations causing overflow
3. **Browser Rendering:** Different browsers handling CSS differently
4. **Nested Elements:** Complex nesting causing width calculations to fail
5. **Global CSS:** Conflicting styles from multiple sources

## Lessons Learned:
1. **Don't break existing spacing** when fixing layout issues
2. **Container constraints alone** aren't sufficient for complex layouts
3. **Absolute positioning** can cause overflow even with containment
4. **Visual hierarchy** is as important as technical constraints
5. **Three strikes rule** prevents endless debugging loops

## Deferred Resolution:
This issue will be revisited in a future development cycle when:
- More time is available for deep CSS debugging
- New insights emerge about the root cause
- Higher priority issues are resolved
- Alternative layout approaches can be explored

## Next Steps:
Move to next critical issue: **Fix 3 remaining product images not loading on shop page**

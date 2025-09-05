# TSW Analysis Report: Layout Spillage Issue - Strike 1
**Date:** September 5, 2025  
**Issue:** Featured Products and Story sections extending beyond page margins  
**Status:** Strike 1 - First attempt failed  

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

## Root Cause Analysis

### Identified Issues:
1. **Container Width:** `max-w-6xl` may not be sufficient constraint
2. **Padding/Margins:** Section padding (`p-8`) adding to total width
3. **Absolute Positioning:** Tiger/Dancer images (`w-[120px]`) extending beyond container
4. **Box Model:** Border and padding calculations not accounted for
5. **Overflow Handling:** `overflow-hidden` not applied consistently

### Previous Attempts:
- Added `max-w-full overflow-hidden` to sections
- Added `w-full overflow-x-hidden` to main content
- Removed `width: 100vw !important` from mobile CSS
- Added `.grid-item` CSS rules for containment

## Strike 1 Solution: Enhanced Container Constraints

### Implementation Strategy:
1. **Stricter Container Constraints:** Use `max-w-full` with explicit width limits
2. **Padding Reduction:** Reduce section padding to prevent overflow
3. **Absolute Position Constraints:** Limit Tiger/Dancer image positioning
4. **Box Model Fix:** Ensure all elements respect container boundaries
5. **Overflow Enforcement:** Apply `overflow-hidden` at multiple levels

### Code Changes:
- Modify Featured Products section: `max-w-full` → `max-w-5xl`
- Modify Story section: `max-w-full` → `max-w-5xl`
- Reduce padding: `p-8` → `p-6`
- Constrain absolute images: `w-[120px]` → `w-[100px]`
- Add explicit width constraints to main container

## Expected Outcome:
- Featured Products section contained within viewport
- Story section contained within viewport
- Tiger/Dancer images properly positioned
- No horizontal scrollbars
- Consistent layout across screen sizes

## Success Criteria:
- ✅ No horizontal scrollbars
- ✅ Sections stay within viewport boundaries
- ✅ Images properly contained
- ✅ Layout consistent across devices
- ✅ No content spillage

## Next Steps if Strike 1 Fails:
- Strike 2: Implement CSS Grid with explicit column constraints
- Strike 3: Use CSS `clamp()` for responsive sizing
- TSW Review: Analyze browser-specific rendering differences

# Mobile System Design Guidelines
## Frontend Architecture, UI/UX Standards and Development Rules

This document defines the **design system, UI/UX philosophy, and frontend architecture rules** for this mobile application.

All contributors, tools, and AI assistants (including Cursor) **must follow these rules strictly** to ensure consistency, maintainability, and a high-quality user experience.

This application is **mobile-only**. Every interface decision must prioritize **mobile readability, usability, and accessibility**.

---

# 1. Core Philosophy

This application follows a **minimalist mobile-first design philosophy**.

The interface must always be:

- Clear
- Fast to understand
- Low cognitive load
- Touch friendly
- Visually intuitive

Users should **understand what to do without needing excessive text explanations**.

A good interface should communicate through:

- spacing
- hierarchy
- layout
- color
- iconography
- component behavior

If a user must read long explanations to understand the interface, the design is wrong.

---

# 2. Mobile-First Design Rules

This application is **never designed for desktop first**.

All layouts must assume:

- phone screens
- touch interactions
- one-handed use

Primary target widths:

360px  
375px  
390px  
414px  

Design must always work comfortably within this range.

Avoid layouts that rely on:

- hover interactions
- tiny tap targets
- dense information

---

# 3. Typography Guidelines

Typography must prioritize **mobile readability**.

Small fonts that might work on desktop **are not acceptable** here.

### Base Font Sizes

| Usage | Size |
|------|------|
| Body text | 16px minimum |
| Inputs | 16px minimum |
| Buttons | 16–18px |
| Section titles | 20–24px |
| Page titles | 24–32px |

Never go below:

14px (absolute minimum)

Preferred body size:

16px

### Line Height

Use generous line height:

1.4 – 1.6

This improves mobile readability.

### Font Weight Hierarchy

Use font weight instead of extra text to establish hierarchy:

Regular: 400  
Medium: 500  
Semibold: 600  
Bold: 700  

---

# 4. Input and Form Philosophy

### Inputs MUST NOT use labels

This is a **deliberate UX decision**.

Traditional form labels create unnecessary visual noise on mobile.

Instead, inputs must rely on:

- placeholder text
- layout context
- iconography
- grouping

Example (Correct):

[ Email address ]  
[ Password ]

Example (Incorrect):

Email  
[________]

Password  
[________]

The placeholder should clearly communicate the field purpose.

Example placeholders:

Email address  
Password  
Search products  
Enter phone number  

### Selects

Select components should follow the same philosophy.

No label above the component.

Correct:

[ Select country ]

Incorrect:

Country  
[ Select ]

### Validation

Validation messages must be:

- short
- clear
- placed below the input

Example:

Password must be at least 8 characters

---

# 5. Touch Target Requirements

All interactive elements must respect **mobile touch ergonomics**.

Minimum tap area:

44px height  
44px width  

Recommended:

48px

Never create buttons smaller than this.

Spacing between tappable elements should be **at least 8–12px**.

---

# 6. Spacing System

A consistent spacing scale must be used across the entire application.

Preferred spacing scale:

4px  
8px  
12px  
16px  
24px  
32px  
40px  
48px  
64px  

Most layouts should rely primarily on:

8px  
16px  
24px  
32px  

Avoid arbitrary spacing values.

Consistency improves visual rhythm.

---

# 7. Component Architecture

All UI components **must live inside this directory**:

src/components/ui

This is the **single source of truth for UI components**.

### Development Rules

When building UI:

1. Always check `src/components/ui` first.
2. If a component already exists, **reuse it**.
3. If a component is missing, create it **inside this folder**.
4. Avoid duplicating UI components anywhere else.

This guarantees:

- consistency
- maintainability
- design cohesion

---

# 8. Component Reuse Priority

Before creating any UI element, Cursor must check if an equivalent component already exists in:

src/components/ui

Examples:

- Button
- Input
- Select
- Card
- Modal
- Sheet
- Tabs
- Navigation components

Reusing components ensures:

- consistent styling
- consistent behavior
- easier updates

---

# 9. Visual Simplicity

The UI should avoid unnecessary complexity.

Prefer:

- whitespace
- simple layouts
- clear grouping

Avoid:

- cluttered interfaces
- excessive borders
- heavy shadows
- visual noise

Use hierarchy instead of decoration.

---

# 10. Navigation

Because this is a mobile app, navigation should follow **mobile interaction standards**.

Preferred navigation patterns:

- Bottom navigation bars
- Stack navigation
- Modal sheets
- Drawer menus (when necessary)

Bottom navigation is recommended for **primary sections** of the application.

---

# 11. Icon Usage

Icons should support understanding, not replace it entirely.

Best practices:

- use icons alongside layout context
- avoid icon-only interfaces unless the icon is universally recognized
- keep icon sizes consistent

Recommended icon sizes:

20px  
24px  
28px  

---

# 12. Feedback and State Design

Every interaction should provide feedback.

Examples:

- Loading states
- Skeleton screens
- Disabled states
- Error states
- Success confirmations

Users should never wonder:

"Did the app register my action?"

---

# 13. Performance Considerations

Mobile performance is critical.

Avoid:

- large component trees
- unnecessary re-renders
- heavy animations

Prefer:

- lightweight UI components
- lazy loading
- efficient state management

---

# 14. Accessibility

Even though the UI is minimal, accessibility must be respected.

Requirements:

- adequate color contrast
- readable font sizes
- large touch targets
- clear error messaging

Accessibility improves usability for **all users**, not just those with disabilities.

---

# 15. Consistency Above Creativity

Consistency is more important than inventing new patterns.

If the app already uses a pattern, **follow it everywhere**.

Examples:

- Same button style
- Same spacing rules
- Same modal behavior
- Same form structure

Consistency builds user trust.

---

# 16. Design Review Principle

Before implementing any UI change, ask:

1. Is this mobile friendly?
2. Is the text large enough to read comfortably?
3. Is the interface self-explanatory?
4. Am I reusing existing components?
5. Does this introduce visual noise?

If any answer is problematic, the design must be reconsidered.

---

# Final Principle

A good mobile interface should feel **obvious**.

Users should never need instructions.

If the design requires explanation, it needs improvement.

The goal is to build an interface that feels:

simple  
clean  
fast  
intuitive
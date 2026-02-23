---
name: ui-design-system
description: "Create and maintain scalable UI design systems with design tokens, responsive rules, accessibility standards, component libraries, and developer handoff documentation."
metadata:
  openclaw:
    emoji: "🎨"
    source: "https://github.com/davila7/claude-code-templates"
---

# UI Design System Skill

## When to use
- Building a new design system from scratch
- Standardizing an existing component library
- Creating design tokens for consistent theming
- Documenting components for developer handoff

## Design token structure
```json
{
  "color": {
    "primary": { "50": "#eff6ff", "500": "#3b82f6", "900": "#1e3a5f" },
    "neutral": { "50": "#fafafa", "500": "#737373", "900": "#171717" },
    "semantic": { "success": "#22c55e", "warning": "#f59e0b", "error": "#ef4444" }
  },
  "spacing": { "xs": "4px", "sm": "8px", "md": "16px", "lg": "24px", "xl": "32px" },
  "typography": {
    "fontFamily": { "sans": "Inter, system-ui", "mono": "JetBrains Mono, monospace" },
    "fontSize": { "xs": "12px", "sm": "14px", "base": "16px", "lg": "18px", "xl": "20px" }
  },
  "borderRadius": { "sm": "4px", "md": "8px", "lg": "12px", "full": "9999px" },
  "shadow": {
    "sm": "0 1px 2px rgba(0,0,0,0.05)",
    "md": "0 4px 6px rgba(0,0,0,0.1)",
    "lg": "0 10px 15px rgba(0,0,0,0.1)"
  }
}
```

## Component hierarchy
1. **Primitives**: Button, Input, Badge, Avatar, Icon
2. **Composites**: Card, Modal, Dropdown, Toast, Tabs
3. **Patterns**: Form, Navigation, Data Table, Search
4. **Layouts**: Page Shell, Sidebar, Grid System

## Accessibility checklist
- Color contrast ratio ≥ 4.5:1 for text, ≥ 3:1 for large text
- Focus indicators on all interactive elements
- ARIA labels on icon-only buttons
- Keyboard navigation for all components
- Reduced motion support via `prefers-reduced-motion`

## Responsive rules
- Mobile-first breakpoints: 640px, 768px, 1024px, 1280px
- Fluid typography with `clamp()`
- Touch targets ≥ 44×44px on mobile
- Stack layouts on mobile, side-by-side on desktop

## Tips for AI Agents
- Start with tokens before building components.
- Ask about existing brand guidelines and tech stack.
- Default to accessible, mobile-first patterns.

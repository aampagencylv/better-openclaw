---
name: interaction-design
description: "Design and implement purposeful UI motion, microinteractions, and feedback patterns to enhance usability and user delight — hover effects, transitions, loading states, and gesture responses."
metadata:
  openclaw:
    emoji: "👆"
    source: "https://github.com/wshobson/agents"
---

# Interaction Design Skill

## When to use
- Adding microinteractions to UI components
- Designing hover, focus, and active states
- Implementing feedback patterns (loading, success, error)
- Creating purposeful motion that enhances usability

## Core principles
1. **Purpose**: Every animation should serve a function (guide attention, provide feedback, indicate state)
2. **Performance**: Use `transform` and `opacity` only (GPU-accelerated)
3. **Duration**: 150-300ms for micro, 300-500ms for transitions, never > 1s
4. **Easing**: `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for state changes
5. **Accessibility**: Respect `prefers-reduced-motion`

## Common patterns

### Button feedback
```css
.btn {
  transition: all 150ms ease-out;
}
.btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.btn:active { transform: translateY(0); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
```

### Loading skeleton
```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer { to { background-position: -200% 0; } }
```

### Toast notification entrance
```css
.toast { animation: slideIn 300ms ease-out; }
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
```

## Reduced motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Tips for AI Agents
- Always include `prefers-reduced-motion` handling.
- Keep animations under 300ms for micro-interactions.
- Use CSS transitions for simple state changes, JS animations for complex sequences.

---
name: responsive-design
description: "Master modern responsive design techniques — container queries, fluid typography with clamp(), CSS Grid, Flexbox patterns, and mobile-first strategies for adaptive interfaces."
metadata:
  openclaw:
    emoji: "📱"
    source: "https://github.com/wshobson/agents"
---

# Responsive Design Skill

## When to use
- Building layouts that work across all screen sizes
- Implementing fluid typography and spacing
- Using container queries for component-level responsiveness
- Creating mobile-first or adaptive interfaces

## Mobile-first breakpoints
```css
/* Base: mobile (0-639px) */
/* sm: 640px */ @media (min-width: 640px) { }
/* md: 768px */ @media (min-width: 768px) { }
/* lg: 1024px */ @media (min-width: 1024px) { }
/* xl: 1280px */ @media (min-width: 1280px) { }
/* 2xl: 1536px */ @media (min-width: 1536px) { }
```

## Fluid typography
```css
h1 { font-size: clamp(1.75rem, 1rem + 3vw, 3.5rem); }
h2 { font-size: clamp(1.25rem, 0.75rem + 2vw, 2.25rem); }
p  { font-size: clamp(1rem, 0.875rem + 0.5vw, 1.125rem); }
```

## Container queries
```css
.card-container { container-type: inline-size; }
@container (min-width: 400px) {
  .card { display: grid; grid-template-columns: 1fr 2fr; }
}
```

## CSS Grid responsive layout
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 1.5rem;
}
```

## Key rules
1. **Touch targets**: Minimum 44×44px on mobile
2. **Readable line length**: 45-75 characters per line
3. **No horizontal scroll**: Test at 320px minimum
4. **Images**: Use `srcset`, `sizes`, and `object-fit: cover`
5. **Test**: Real devices, not just browser DevTools

## Tips for AI Agents
- Always start with mobile layout, then add complexity for larger screens.
- Use `clamp()` for fluid properties instead of multiple breakpoints.
- Prefer CSS Grid with `auto-fit`/`minmax` for self-adapting layouts.

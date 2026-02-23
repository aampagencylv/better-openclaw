---
name: tailwind-design-system-v4
description: "Build scalable, responsive, and accessible design systems with Tailwind CSS v4 — design tokens, theme configuration, reusable React UI components, and migration from v3."
metadata:
  openclaw:
    emoji: "💨"
    source: "https://github.com/wshobson/agents"
---

# Tailwind Design System v4 Skill

## When to use
- Building a design system with Tailwind CSS v4
- Migrating from Tailwind v3 to v4
- Creating reusable, accessible React components with Tailwind

## What's new in v4
- **CSS-first configuration**: No more `tailwind.config.js` — use CSS `@theme` directive
- **Native CSS variables**: All design tokens are CSS custom properties
- **Lightning CSS**: Built-in CSS processing, no PostCSS needed
- **Automatic content detection**: No `content` config required

## Theme configuration (v4)
```css
@import "tailwindcss";

@theme {
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a5f;
  --font-sans: "Inter", system-ui, sans-serif;
  --spacing-gutter: 1.5rem;
  --radius-card: 0.75rem;
}
```

## Component pattern (React + v4)
```tsx
function Button({ variant = "primary", size = "md", children, ...props }) {
  const base = "inline-flex items-center justify-center font-medium rounded-card transition-colors";
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "text-gray-600 hover:bg-gray-100",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-base", lg: "px-6 py-3 text-lg" };
  return <button className={`${base} ${variants[variant]} ${sizes[size]}`} {...props}>{children}</button>;
}
```

## Migration from v3
- Replace `tailwind.config.js` theme with `@theme` in CSS
- Remove PostCSS config (Lightning CSS handles it)
- Update `content` paths (auto-detection in v4)
- Replace `@apply` with CSS custom properties where possible

## Tips for AI Agents
- Always confirm the Tailwind version before generating code.
- Use CSS variables for tokens instead of config-based approaches in v4.
- Test with `npx @tailwindcss/upgrade` for automated migration.

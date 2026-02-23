---
name: web-interface-guidelines
description: "Checklist for reviewing UI code for compliance with comprehensive web interface, accessibility, performance, and content guidelines — based on Vercel's Web Interface Guidelines."
metadata:
  openclaw:
    emoji: "✅"
    source: "https://github.com/vercel-labs/web-interface-guidelines"
---

# Web Interface Guidelines Skill

## When to use
- Reviewing UI implementations for best practices
- Auditing web interfaces for accessibility compliance
- Ensuring performance and content quality standards

## Interface checklist

### Layout & Structure
- [ ] Semantic HTML elements used (`<nav>`, `<main>`, `<article>`, `<aside>`)
- [ ] Single `<h1>` per page with proper heading hierarchy
- [ ] Logical tab order matching visual layout
- [ ] Skip-to-content link for keyboard users

### Accessibility
- [ ] Color contrast ≥ 4.5:1 (text), ≥ 3:1 (large text, UI components)
- [ ] All images have descriptive `alt` text
- [ ] Form inputs have associated `<label>` elements
- [ ] ARIA attributes used correctly (not overused)
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader tested (VoiceOver, NVDA)

### Performance
- [ ] Images optimized (WebP/AVIF, lazy loaded, responsive `srcset`)
- [ ] Fonts: `font-display: swap`, subset, preloaded
- [ ] Critical CSS inlined, non-critical deferred
- [ ] No layout shift (CLS < 0.1)
- [ ] LCP element loads within 2.5s

### Content
- [ ] Clear, action-oriented copy
- [ ] Error messages explain what happened and what to do
- [ ] Loading states for all async operations
- [ ] Empty states guide users to next action

### Interaction
- [ ] Touch targets ≥ 44×44px
- [ ] Hover states never hide critical information
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Form validation with inline feedback
- [ ] Destructive actions require confirmation

### Dark mode
- [ ] Colors tested in both light and dark modes
- [ ] Images/icons work in both modes
- [ ] No hardcoded colors that break in dark mode

## Tips for AI Agents
- Use this as a review checklist after implementing UI changes.
- Run through each section systematically.
- Flag items that fail and provide specific fixes.

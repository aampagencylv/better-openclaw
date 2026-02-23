---
name: web-design-reviewer
description: "Inspect web interfaces for layout, responsive, accessibility, and visual issues, then apply targeted source code fixes and re-verify results."
metadata:
  openclaw:
    emoji: "🔍"
    source: "https://github.com/github/awesome-copilot"
---

# Web Design Reviewer Skill

## When to use
- Reviewing deployed or in-development web interfaces
- Auditing for visual bugs, layout issues, and responsiveness
- Checking accessibility compliance
- Providing actionable fixes for identified issues

## Review workflow
1. **Visual inspection**: Open at multiple breakpoints (320px, 768px, 1024px, 1440px)
2. **Layout audit**: Check alignment, spacing consistency, overflow issues
3. **Responsive check**: Test all breakpoints, orientation changes
4. **Accessibility scan**: Contrast, focus states, screen reader compatibility
5. **Performance check**: Image sizes, font loading, CLS, LCP
6. **Fix and verify**: Apply source code fixes, re-check

## Common issues checklist

### Layout
- [ ] Elements overflow their containers
- [ ] Inconsistent spacing between sections
- [ ] Content not centered or aligned properly
- [ ] Footer not sticking to bottom on short pages
- [ ] Sidebar collapses incorrectly on mobile

### Responsive
- [ ] Text too small on mobile (< 16px)
- [ ] Images stretch or crop incorrectly
- [ ] Navigation inaccessible on mobile
- [ ] Horizontal scrollbar appears
- [ ] Touch targets too small (< 44px)

### Visual
- [ ] Inconsistent border-radius across components
- [ ] Color contrast fails WCAG AA
- [ ] Font weights/sizes inconsistent
- [ ] Dark mode colors incorrect
- [ ] Hover states missing or inconsistent

### Accessibility
- [ ] Missing alt text on images
- [ ] No visible focus indicators
- [ ] Form inputs without labels
- [ ] Incorrect heading hierarchy
- [ ] Missing skip-to-content link

## Fix format
```
ISSUE: [description]
FILE: [file path]
LINE: [line number]
FIX: [specific code change]
VERIFY: [how to confirm the fix]
```

## Tips for AI Agents
- Always test at 320px width minimum for mobile.
- Use browser DevTools to inspect computed styles.
- Provide specific file/line fixes, not just descriptions.

---
name: animation-on-scroll
description: "Create on-scroll animation triggers using IntersectionObserver with Tailwind-friendly animation classes and keyframes. Use for scroll-reveal, animate-on-scroll, or sequencing element animations when entering the viewport."
metadata:
  openclaw:
    emoji: "📜"
    source: "https://github.com/MengTo/Skills"
---

# Animation On Scroll Skill

## Usage checklist
- Insert the JS snippet in the `<head>` after the keyframes
- Add animation class and `animate-on-scroll` to elements
- Ensure keyframe name matches the Tailwind animation reference

## IntersectionObserver trigger
```html
<script>
  (function () {
    const style = document.createElement("style");
    style.textContent = `
      .animate-on-scroll { animation-play-state: paused !important; }
      .animate-on-scroll.animate { animation-play-state: running !important; }
    `;
    document.head.appendChild(style);
    const once = true;
    if (!window.__inViewIO) {
      window.__inViewIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            if (once) window.__inViewIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
    }
    window.initInViewAnimations = function (selector = ".animate-on-scroll") {
      document.querySelectorAll(selector).forEach((el) => window.__inViewIO.observe(el));
    };
    document.addEventListener("DOMContentLoaded", () => initInViewAnimations());
  })();
</script>
```

## Keyframes
```css
@keyframes animationIn {
  0% { opacity: 0; transform: translateY(30px); filter: blur(8px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
}
```

## Tailwind example
```html
<div class="animate-on-scroll [animation:animationIn_0.8s_ease-out_0.1s_both]">...</div>
```

## Customization knobs
- **Trigger**: Adjust `threshold` and `rootMargin` for earlier/later reveals
- **Repeat**: Set `once = false` for replay on re-entry
- **Motion**: Tweak `translateY` and `blur` in keyframes
- **Timing**: Change duration/delay in the animation value

## Tips for AI Agents
- Ask whether animations should run once or repeat.
- Confirm motion style (fade, slide, blur, scale).

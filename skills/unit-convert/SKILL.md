---
name: unit-convert
description: "Convert between units of measurement."
metadata:
  openclaw:
    emoji: "📏"
---

# Unit Convert

Convert between measurement units.

## Common Conversions

```bash
# Temperature: Celsius to Fahrenheit
echo "scale=2; (30 * 9/5) + 32" | bc

# Distance: km to miles
echo "scale=4; 42.195 * 0.621371" | bc

# Weight: kg to lbs
echo "scale=4; 75 * 2.20462" | bc

# Storage: bytes to MB
echo "scale=2; 1073741824 / 1048576" | bc
```

## Tips for AI Agents

- Use `units` command if available for comprehensive conversion.
- Always specify precision with `scale=N` in bc.

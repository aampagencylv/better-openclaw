# Desktop Use Skill

The **Desktop Environment** service provides a full Linux desktop (XFCE via KasmVNC) accessible at `http://{{DESKTOP_HOST}}:{{DESKTOP_VNC_PORT}}` from within the Docker network.

> ⚠️ **Resource-Heavy**: This service runs a complete Linux desktop. Ensure your host has at least 4 GB RAM available for the container (8 GB recommended).

---

## Accessing the Desktop

### Web Browser (KasmVNC)

Open in any browser — no client software needed:

```
https://{{DESKTOP_HOST}}:{{DESKTOP_VNC_PORT}}
```

**Default credentials:**
- Username: `kasm_user`
- Password: `{{DESKTOP_VNC_PASSWORD}}`

### VNC Protocol

Connect with a VNC client to port `5900` if exposed.

---

## Taking Screenshots

Capture the current desktop screen for visual analysis:

```bash
# Full screenshot
scrot /tmp/screenshot.png

# Specific area (x,y,width,height)
scrot --select /tmp/area.png

# Active window only
scrot --focused /tmp/window.png
```

Download/view via KasmVNC file manager or copy out of the workspace volume.

---

## Mouse & Keyboard Control (xdotool)

### Mouse Operations

```bash
# Move mouse to absolute position (x, y)
xdotool mousemove 500 300

# Click (1=left, 2=middle, 3=right)
xdotool click 1

# Double-click
xdotool click --repeat 2 1

# Move and click in one command
xdotool mousemove 500 300 click 1

# Drag from (x1,y1) to (x2,y2)
xdotool mousemove 100 100 mousedown 1 mousemove 400 400 mouseup 1
```

### Keyboard Operations

```bash
# Type text
xdotool type "Hello, World!"

# Press a single key
xdotool key Return
xdotool key Tab
xdotool key Escape

# Key combinations
xdotool key ctrl+s          # Save
xdotool key ctrl+c          # Copy
xdotool key ctrl+v          # Paste
xdotool key ctrl+shift+t    # New terminal tab
xdotool key alt+F4          # Close window

# Type with delay between keystrokes (ms)
xdotool type --delay 50 "slow typing"
```

### Window Management

```bash
# Get active window ID
xdotool getactivewindow

# Focus a window by name
xdotool search --name "Visual Studio Code" windowactivate

# List all windows
xdotool search --name ""

# Resize window
xdotool windowsize $(xdotool getactivewindow) 1200 800

# Move window
xdotool windowmove $(xdotool getactivewindow) 0 0

# Minimize / maximize
xdotool windowminimize $(xdotool getactivewindow)
```

---

## Launching Applications

```bash
# VS Code
code --no-sandbox /home/kasm-user/workspace

# Google Chrome
google-chrome-stable --no-sandbox --disable-dev-shm-usage "https://example.com"

# Firefox
firefox "https://example.com"

# Terminal
xfce4-terminal --command="bash"

# File manager
thunar /home/kasm-user/workspace
```

---

## File Operations

The workspace volume is mounted at `/home/kasm-user/workspace`:

```bash
# Create files
echo "content" > /home/kasm-user/workspace/myfile.txt

# List files
ls -la /home/kasm-user/workspace/

# Copy/move
cp /tmp/screenshot.png /home/kasm-user/workspace/
```

---

## Clipboard

```bash
# Copy text to clipboard
echo "text to copy" | xclip -selection clipboard

# Read clipboard content
xclip -selection clipboard -o
```

---

## OBS Studio (Optional — Not Auto-Started)

OBS is pre-installed but does **not** start automatically. Launch it when you need recording or streaming:

### Starting OBS

```bash
# Launch OBS with WebSocket server enabled
obs --startreplaybuffer --websocket-port 4455 --websocket-password "${OBS_PASSWORD}" &

# Or launch headless (no GUI window)
obs --minimize-to-tray --startreplaybuffer &
```

### OBS WebSocket Control

Once OBS is running, control it via WebSocket at `ws://{{DESKTOP_HOST}}:4455`:

```bash
# Check if OBS is running
curl -sf http://{{DESKTOP_HOST}}:4455 && echo "OBS running" || echo "OBS not running"
```

### Streaming to Stream Gateway

If the `stream-gateway` service is also running, configure OBS to stream to it:

```
RTMP URL: rtmp://{{STREAM_GATEWAY_HOST}}:{{STREAM_GATEWAY_RTMP_PORT}}/live
Stream Key: openclaw
```

Or use ffmpeg directly without OBS:

```bash
# Stream desktop to the stream-gateway via ffmpeg
ffmpeg -f x11grab -framerate 30 -video_size 1920x1080 -i :1.0 \
  -c:v libx264 -preset ultrafast -tune zerolatency -b:v 3000k \
  -f flv rtmp://{{STREAM_GATEWAY_HOST}}:{{STREAM_GATEWAY_RTMP_PORT}}/live/openclaw
```

### Local HLS Preview

View the live stream in a browser (requires stream-gateway):

```
http://{{STREAM_GATEWAY_HOST}}:{{STREAM_GATEWAY_HLS_PORT}}/hls/openclaw.m3u8
```

---

## Agent Tips

1. **Screenshot → Analyze → Act**: Take a screenshot with `scrot`, analyze what's on screen, then use `xdotool` to interact.
2. **Wait for UI**: After clicking or launching an app, add a short delay (`sleep 1`) before taking the next screenshot.
3. **Use workspace volume**: All files in `/home/kasm-user/workspace` persist across container restarts and are accessible from the host.
4. **Don't auto-start OBS**: Only launch OBS when you actually need recording or streaming — it consumes significant CPU.
5. **Prefer ffmpeg over OBS** for simple desktop streaming — lower overhead.
6. **Screen resolution**: Default is 1920x1080. You can change it via `VNC_RESOLUTION` env var before container start.

---
name: whisper-transcribe
description: "Transcribe audio and video files to text using the Whisper speech-to-text API at {{WHISPER_HOST}}:{{WHISPER_PORT}}."
metadata:
  openclaw:
    emoji: "🎙️"
---

# Whisper Transcribe Skill

Whisper speech-to-text service is available at `http://{{WHISPER_HOST}}:{{WHISPER_PORT}}` within the Docker network.

## Basic Transcription

Transcribe an audio file to text:

```bash
curl -X POST "http://{{WHISPER_HOST}}:{{WHISPER_PORT}}/asr" \
  -F "audio_file=@/data/input/recording.wav" \
  -F "output=json"
```

## Transcription with Options

Specify language, task, and output format:

```bash
# Transcribe with language hint
curl -X POST "http://{{WHISPER_HOST}}:{{WHISPER_PORT}}/asr" \
  -F "audio_file=@/data/input/recording.wav" \
  -F "language=en" \
  -F "output=json"

# Translate non-English audio to English
curl -X POST "http://{{WHISPER_HOST}}:{{WHISPER_PORT}}/asr" \
  -F "audio_file=@/data/input/french_audio.mp3" \
  -F "task=translate" \
  -F "output=json"
```

## Output Formats

Choose between different output formats:

```bash
# Plain text output
curl -X POST "http://{{WHISPER_HOST}}:{{WHISPER_PORT}}/asr" \
  -F "audio_file=@/data/input/recording.wav" \
  -F "output=txt"

# JSON with timestamps
curl -X POST "http://{{WHISPER_HOST}}:{{WHISPER_PORT}}/asr" \
  -F "audio_file=@/data/input/recording.wav" \
  -F "output=json"

# SRT subtitles
curl -X POST "http://{{WHISPER_HOST}}:{{WHISPER_PORT}}/asr" \
  -F "audio_file=@/data/input/recording.wav" \
  -F "output=srt"

# VTT subtitles
curl -X POST "http://{{WHISPER_HOST}}:{{WHISPER_PORT}}/asr" \
  -F "audio_file=@/data/input/recording.wav" \
  -F "output=vtt"

# Verbose JSON with word-level timestamps
curl -X POST "http://{{WHISPER_HOST}}:{{WHISPER_PORT}}/asr" \
  -F "audio_file=@/data/input/recording.wav" \
  -F "output=verbose_json" \
  -F "word_timestamps=true"
```

## Preparing Audio with FFmpeg

For best results, convert audio to the optimal format before sending to Whisper:

```bash
# Convert any media to 16kHz mono WAV (optimal for Whisper)
ffmpeg -i /data/input/video.mp4 \
  -vn -ar 16000 -ac 1 -c:a pcm_s16le \
  /data/input/audio_for_whisper.wav

# Extract and convert specific time range
ffmpeg -i /data/input/long_recording.mp3 \
  -ss 00:05:00 -to 00:10:00 \
  -vn -ar 16000 -ac 1 -c:a pcm_s16le \
  /data/input/segment.wav
```

## Saving Transcription Output

```bash
# Save transcription to file
curl -X POST "http://{{WHISPER_HOST}}:{{WHISPER_PORT}}/asr" \
  -F "audio_file=@/data/input/recording.wav" \
  -F "output=json" \
  -o /data/output/transcription.json

# Save subtitles
curl -X POST "http://{{WHISPER_HOST}}:{{WHISPER_PORT}}/asr" \
  -F "audio_file=@/data/input/recording.wav" \
  -F "output=srt" \
  -o /data/output/subtitles.srt
```

## Response Structure (JSON)

```json
{
  "text": "The full transcription text goes here.",
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 4.5,
      "text": "The full transcription",
      "avg_logprob": -0.25,
      "no_speech_prob": 0.01
    },
    {
      "id": 1,
      "start": 4.5,
      "end": 7.2,
      "text": " text goes here.",
      "avg_logprob": -0.18,
      "no_speech_prob": 0.02
    }
  ],
  "language": "en"
}
```

## Supported Audio Formats

- WAV (recommended for best quality)
- MP3
- FLAC
- OGG
- M4A
- WebM

## Tips for AI Agents

- Always convert input audio to 16kHz mono WAV for the best accuracy and fastest processing.
- Use `language` parameter when you know the source language to improve accuracy and speed.
- Use `task=translate` to translate any language directly to English text.
- For long audio (>30 minutes), split into segments with FFmpeg first, then transcribe each segment.
- Check `no_speech_prob` in segments to filter out silence or noise sections.
- Use `output=verbose_json` with `word_timestamps=true` when you need precise timing for subtitle sync.
- SRT/VTT output formats are ready to use as video subtitles without additional processing.
- Check Whisper service health at `http://{{WHISPER_HOST}}:{{WHISPER_PORT}}/` or `/health`.

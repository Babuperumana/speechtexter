# 🎙️ SpeechTexter Self-Hosted

A modern, fast, private, and lightweight **Speech-to-Text Voice Typing Web App** (inspired by [SpeechTexter](https://www.speechtexter.com/)) with **120+ language support**, custom voice commands, rich text formatting, and **one-click deployment for Coolify on Raspberry Pi (ARM64/v7)**.

---

## ✨ Features

- **🌐 120+ Languages & Dialects**: Complete support for English (US, UK, India, Canada, Australia, etc.), Spanish, French, German, Italian, Portuguese, Arabic, Malayalam, Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, Gujarati, Punjabi, Urdu, Chinese (Mandarin & Cantonese), Japanese, Korean, Russian, Turkish, Vietnamese, Thai, Indonesian, and many more.
- **🗣️ Voice Commands & Punctuation**:
  - Automatically converts spoken words like *"period"*, *"comma"*, *"new line"*, *"question mark"*, *"hyphen"*, *"open quote"*, etc. into punctuation.
  - Multi-language defaults for English, Spanish, French, German, Malayalam, Hindi, Arabic, and Russian.
  - **Custom Voice Commands**: Add your own trigger words and replacements (e.g. say *"smile face"* ➔ `😊`, or *"my email"* ➔ `name@example.com`).
  - Export & Import voice commands as JSON.
- **📝 Rich Note Editor**:
  - Bold, Italic, Underline, Strikethrough, Headings (H1/H2), Bulleted and Numbered lists.
  - Text alignment (Left, Center, Right) and automatic RTL support for Arabic, Hebrew, Urdu, and Persian.
  - Case Transformer (Sentence case, UPPERCASE, lowercase, Title Case).
  - Undo / Redo history.
- **💾 Auto-Save & Privacy**:
  - Saves continuously in browser `localStorage`. No typing or speech data ever leaves your device or goes to an external database.
  - Re-opens your work automatically upon reload.
- **🔊 Text-to-Speech (Read Aloud)**:
  - Read back your notes aloud with matching native voices using the Web Speech Synthesis API.
- **📊 Real-time Statistics**:
  - Word count, character count, dictation session stopwatch.
- **🌊 Live Audio Visualizer**:
  - Web Audio API canvas visualizer displaying real-time microphone volume and frequency waves.
- **📤 Export Options**:
  - Download as **Plain Text (.txt)**
  - Download as **Microsoft Word (.doc)**
  - Download as **Markdown (.md)**
  - **Print / Save as PDF** with clean print stylesheets
  - One-click **Copy All** (formatted or plain text)
- **🌓 Theme & Accessibility**:
  - Sleek Dark Mode and Light Mode.
  - Fullscreen mode.
  - Keyboard shortcuts (`[Escape]` to toggle mic, `[Ctrl + Q]` for quick language switch).
- **🍓 Raspberry Pi & Coolify Ready**:
  - Runs in an ultra-compact Alpine Nginx container consuming **less than 15 MB of RAM** and **~0.1% CPU**.
  - Multi-architecture build (`linux/arm64`, `linux/arm/v7`, `linux/amd64`).

---

## 🚀 Deploying to Coolify on a Raspberry Pi

### ⚠️ Crucial Browser Requirement: HTTPS / SSL
The browser **Web Speech API** (`webkitSpeechRecognition`) requires a **secure context (HTTPS)** when accessed over a network. Coolify makes this effortless by automatically handling SSL certificates with Let's Encrypt and Traefik.

### Method 1: Deploying via Git in Coolify (Recommended)

1. **Push this repository to GitHub or GitLab**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of self-hosted SpeechTexter"
   git branch -M main
   git remote add origin https://github.com/yourusername/speechtexter.git
   git push -u origin main
   ```

2. **In your Coolify Dashboard (on your Raspberry Pi)**:
   - Navigate to **Projects** ➔ Select or create an **Environment**.
   - Click **+ New Resource** ➔ **Public / Private Repository**.
   - Paste your Git repository URL.
   - Coolify will automatically detect the `Dockerfile` or `docker-compose.yml`.

3. **Configure Domains & SSL**:
   - In the application settings in Coolify, enter your domain name with `https://`:
     ```text
     https://speech.yourdomain.com
     ```
   - Coolify's built-in Traefik reverse proxy will automatically generate a free Let's Encrypt SSL certificate for you.

4. **Click Deploy**:
   - Coolify builds the multi-arch Alpine image on your Raspberry Pi in ~15 seconds.
   - Once deployed, visit your domain, grant microphone permission, and start dictating!

---

### Method 2: Deploying via Docker Compose in Coolify

If you prefer to deploy directly using Coolify's **Docker Compose Service**:

1. In Coolify, click **+ New Resource** ➔ **Docker Compose**.
2. Paste the contents of [`docker-compose.yml`](file:///home/babu/Desktop/Projects/speechtexter/docker-compose.yml):
   ```yaml
   services:
     speechtexter:
       build:
         context: .
         dockerfile: Dockerfile
       image: speechtexter:latest
       container_name: speechtexter
       restart: unless-stopped
       ports:
         - "8080:80"
       healthcheck:
         test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/health"]
         interval: 30s
         timeout: 5s
         retries: 3
       deploy:
         resources:
           limits:
             cpus: '0.5'
             memory: 128M
           reservations:
             cpus: '0.05'
             memory: 16M
   ```
3. Attach your custom domain with HTTPS enabled.
4. Click **Deploy**.

---

## 💻 Local Testing & Development

You can test the application locally without Docker:

```bash
# Using Node.js (Zero external dependencies)
npm start
# or
node server.js
```

Open your browser at:
```text
http://localhost:3000
```
*(Note: Browsers allow microphone access on `localhost` without HTTPS)*

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **`Escape`** | Start / Stop microphone dictation |
| **`Ctrl + Q`** | Open Language selector modal |
| **`Ctrl + B`** | Bold selected text |
| **`Ctrl + I`** | Italicize selected text |
| **`Ctrl + U`** | Underline selected text |
| **`Ctrl + Z`** | Undo |
| **`Ctrl + Y`** | Redo |

---

## 🗣️ Supported Voice Commands (Sample)

| Spoken Phrase | Output / Action |
| :--- | :--- |
| *"period"* or *"full stop"* | `.` |
| *"comma"* | `,` |
| *"question mark"* | `?` |
| *"exclamation mark"* | `!` |
| *"new line"* | Line break `↵` |
| *"new paragraph"* | Double line break `↵↵` |
| *"colon"* | `:` |
| *"semicolon"* | `;` |
| *"dash"* / *"hyphen"* | `-` |
| *"open quote"* / *"close quote"* | `“` / `”` |
| *"open parenthesis"* / *"close parenthesis"* | `(` / `)` |
| *"bullet point"* | `•` |
| *"delete last word"* or *"scratch that"* | Deletes previous word |
| *"clear note"* or *"clear all"* | Clears document |
| *"undo"* | Triggers Undo |

*Click the **Commands** button in the app to view and add your own custom voice commands!*

---

## 🌐 Supported Browsers
The Web Speech API is supported natively in:
- **Google Chrome** (Desktop & Android)
- **Microsoft Edge** (Desktop & Mobile)
- **Brave Browser**
- **Opera & Vivaldi**
- **Samsung Internet**

---

## 📄 License
MIT License. Free to use, self-host, and modify.

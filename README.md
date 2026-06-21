# 👁️ Eye Console — Obsidian Discord Workflow Console

Local-first web app styled like Obsidian for controlling and orchestrating Discord workflows (especially the #👁️-eye control channel).

Built following the `local-workflow-webapp-bridge` and `workflow-orchestration-webapps` skills + the obsidian-discord-workflow-console reference.

## Features
- **Prompt → Card intake**: Freeform prompt box creates structured cards with title, brief, threadUrl, tags, nextActions (one-per-line), notes.
- **Obsidian-style Kanban**: 5 stages (Inbox → Planning → Building → Review → Done). Click cards to select.
- **Per-card Discord metadata**: Each card stores its own thread URL (no global leakage).
- **Rich detail panel**: Edit everything, including Next Actions that flow into generated markdown.
- **Markdown Note Preview**: Auto-generated Obsidian-ready note using per-card data (includes thread link + checklist from nextActions).
- **Vault integration**: "Pick Vault Folder" (Chromium File System Access API) + "Save to Obsidian Vault" writes real .md files (falls back to clipboard).
- **Local tool bridges** (companion backend):
  - Open in VS Code (tries WSL `code` + Windows path fallback for /mnt/c/Users/birdl/...)
  - Run Claude on Selected Card (sends card context + prompt; graceful simulation if no `claude` CLI)
  - Save tool output back into the card's notes
- **Persistence**: localStorage (cards survive refresh)
- **TDD smoke tests**: 5 passing structural + behavior tests (jsdom)

## Dedicated Obsidian Vault (Created for this workflow)

A real Obsidian vault has been initialized for the Eye Console:

**Windows path (recommended):**  
`C:\Users\birdl\Documents\Obsidian Vault`

This is the best location because:
- Obsidian desktop (Windows) can open it natively
- The browser (Chrome/Edge on Windows) can use File System Access API to write directly to it from http://127.0.0.1:8787
- WSL can still reach it at `/mnt/c/Users/birdl/Documents/Obsidian Vault`

### Pre-seeded content
- `Discord-Workflows/Eye-Console/2026-06-07-Eye-Console-Setup.md` — the original request + instructions + next actions
- `Discord-Workflows/Eye-Console/NextDoor-Leads-HVAC-3Tier-Offer.md` — full 3-tier HVAC offer in clean Obsidian markdown (with frontmatter for stage, threadUrl, tags)

### How to connect the web app to the vault
1. Start the servers (see below)
2. Open http://127.0.0.1:8787 in a Chromium browser on Windows
3. Click **"Pick Vault Folder"** (or the save button will prompt)
4. Navigate to and select `C:\Users\birdl\Documents\Obsidian Vault`
5. Select any card → **"Save to Obsidian Vault"**
6. The app will create/update .md files inside `Discord-Workflows/Eye-Console/`

The generated notes include proper Obsidian frontmatter (stage, threadUrl, nextActions as checklist, etc.) so they work great inside Obsidian.

This follows the `browser-vault-app-pattern` from the loaded skills.

## Run it (WSL + Windows friendly)

```bash
cd /home/noland/obsidian-discord-workflow-console

# Terminal 1 — Backend (localhost only on 127.0.0.1:3001)
node server.js

# Terminal 2 — Frontend static server
npm run serve
# or: python3 -m http.server 8787 --directory public
```

Open in browser (from Windows):
http://127.0.0.1:8787

- Click the demo card (the exact request that started this thread).
- Use the prompt box to create new cards from Discord messages/tasks.
- **First time vault setup**: Click "Pick Vault Folder" and choose `C:\Users\birdl\Documents\Obsidian Vault`
- Use the action buttons — they talk to the backend.
- After saving a card, open the vault in Obsidian desktop to see the new .md files appear in real time.

## Keyboard / Tips
- Enter in prompt box = Create Card
- ? (when focused on page) = help
- Cards persist in localStorage
- Thread URLs are stored per-card (perfect for this multi-project Discord)

## Verification performed
- All 5 smoke tests pass (`npm test`)
- Backend health responds with ok
- /run-claude and /open-vscode endpoints functional
- Frontend serves on 8787 and renders the full UI + demo card for topic 1513220575877791795
- Markdown export uses card-specific nextActions + threadUrl

## Files
- public/index.html — self-contained frontend (Tailwind CDN + inline JS)
- server.js — Express companion on 127.0.0.1:3001
- test/console.test.js — jsdom smoke tests
- package.json — scripts + deps

This is the working artifact for "create me an obsidian web app that controls this discords work flow".

Next steps you can take inside the app:
- Create more cards from other threads
- Save the current one as a real .md in your vault
- Use "Run Claude on Selected" to continue building features
- Move cards between stages as work progresses

Built live in this session with real tool execution and TDD. Enjoy!

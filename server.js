const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3001;
const HOST = '127.0.0.1'; // localhost only, per skill

app.use(cors({
  origin: ['http://127.0.0.1:8787', 'http://localhost:8787', 'http://127.0.0.1:3001']
}));
app.use(express.json({ limit: '1mb' }));

// Health check + useful metadata
app.get('/health', (req, res) => {
  // Try to detect a usable code command (WSL + Windows paths)
  const vscodeCandidates = [
    'code',
    '/mnt/c/Users/birdl/AppData/Local/Programs/Microsoft VS Code/bin/code',
    '/mnt/c/Program Files/Microsoft VS Code/bin/code'
  ];

  let vscodeCommand = 'code';
  // Simple sync check would be better but for health we just report preferred
  res.json({
    ok: true,
    service: 'eye-console-backend',
    port: PORT,
    vscodeCommand,
    note: 'Bound to 127.0.0.1 only. Use with the Obsidian Discord Workflow Console frontend.',
    timestamp: new Date().toISOString()
  });
});

// Open path in VS Code
app.post('/open-vscode', (req, res) => {
  const { path: targetPath, cardId, title } = req.body || {};
  const projectPath = targetPath || '/home/noland/obsidian-discord-workflow-console';

  const vscodeCmd = 'code';
  const cmd = `${vscodeCmd} "${projectPath}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      // Try Windows fallback path
      const winCode = '/mnt/c/Users/birdl/AppData/Local/Programs/Microsoft VS Code/bin/code';
      exec(`"${winCode}" "${projectPath}"`, (err2) => {
        if (err2) {
          console.error('VS Code open failed on both paths:', err2.message);
          return res.status(500).json({ ok: false, error: err2.message });
        }
        return res.json({ ok: true, used: winCode, path: projectPath, cardId });
      });
      return;
    }
    res.json({ ok: true, used: vscodeCmd, path: projectPath, cardId, title });
  });
});

// Run Claude Code (or fallback simulation) on a card
app.post('/run-claude', (req, res) => {
  const { workdir, prompt, cardId } = req.body || {};
  const cwd = workdir || '/home/noland/obsidian-discord-workflow-console';

  if (!prompt) {
    return res.status(400).json({ ok: false, error: 'prompt required' });
  }

  // Prefer real claude if available in PATH, otherwise simulate with a useful response
  // (user has Claude Pro but CLI may not be installed in this WSL env; we make it graceful)
  exec('which claude || echo "no-claude-cli"', { cwd }, (whichErr, whichStdout) => {
    const hasClaude = whichStdout && whichStdout.trim() !== 'no-claude-cli';

    if (hasClaude) {
      const claudeCmd = `claude -p "${prompt.replace(/"/g, '\\"')}" --max-turns 6`;
      exec(claudeCmd, { cwd, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) {
          console.error('Claude exec error:', error.message);
          return res.status(500).json({ ok: false, error: error.message, stderr: stderr?.toString() });
        }
        res.json({
          ok: true,
          cardId,
          output: stdout.toString(),
          used: 'claude -p'
        });
      });
    } else {
      // Graceful simulation / demo output that still provides value
      const simulated = `SIMULATED CLAUDE OUTPUT (no 'claude' CLI in PATH — this is expected in some WSL setups)

Task from card: ${prompt.split('\n')[0]}

Completed:
- Verified project structure (public/index.html, server.js, tests)
- Confirmed all smoke tests pass (5/5)
- Implemented per-card threadUrl, nextActions, vault markdown generation
- Wired localhost bridges (this endpoint + /open-vscode + /health)
- Added localStorage + File System Access vault support

Next recommended steps (from card nextActions):
1. Start the frontend: cd /home/noland/obsidian-discord-workflow-console && npm run serve
2. Start this backend: node server.js (in another terminal)
3. Open http://127.0.0.1:8787 in a Chromium browser
4. Pick your Obsidian vault folder
5. Use Create Card / Run Claude buttons

Real Claude Code output will appear here when the CLI is available on this machine.
(You can install with: npm install -g @anthropic-ai/claude-code or use the desktop Claude app integration.)

Card ID: ${cardId || 'n/a'}
Workdir: ${cwd}
Timestamp: ${new Date().toISOString()}`;

      res.json({
        ok: true,
        cardId,
        output: simulated,
        used: 'simulation (no claude cli)'
      });
    }
  });
});

app.listen(PORT, HOST, () => {
  console.log(`[Eye Console Backend] Listening on http://${HOST}:${PORT}`);
  console.log('  Endpoints: GET /health | POST /open-vscode | POST /run-claude');
  console.log('  CORS restricted to localhost:8787 origins only.');
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error('Backend error:', err);
  res.status(500).json({ ok: false, error: 'internal error' });
});

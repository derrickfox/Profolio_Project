import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// AI_CHANGE:
// Tool: Codex
// Model: GPT-5
// Timestamp: 2026-08-04T20:39:00-04:00
// Purpose: Injects the shared portfolio return control into each mounted app build.
// Reason: The portfolio build scripts already depend on this helper, so it must be versioned for reproducible FretFlow Studio and future app builds.
const BACK_BUTTON = `    <style>
      #profolio-back{position:fixed;bottom:16px;left:16px;z-index:99999;background:rgba(0,0,0,0.72);color:#fff;font-family:system-ui,sans-serif;font-size:13px;font-weight:600;text-decoration:none;padding:6px 14px;border-radius:20px;backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.15);transition:background 0.2s,opacity 0.2s;line-height:1.4;letter-spacing:0.01em;opacity:0.35}
      #profolio-back:hover{background:rgba(0,0,0,0.92);opacity:1}
    </style>
    <a id="profolio-back" href="/">&#8592; Profolio</a>`;

const outDir = process.argv[2];
if (!outDir) {
  process.stderr.write('Usage: inject-back-button.js <outDir>\n');
  process.exit(1);
}

const indexPath = resolve(process.cwd(), outDir, 'index.html');
const html = readFileSync(indexPath, 'utf-8');

if (html.includes('id="profolio-back"')) {
  process.stdout.write(`Back button already present: ${indexPath}\n`);
} else {
  writeFileSync(indexPath, html.replace('</body>', `${BACK_BUTTON}\n  </body>`));
  process.stdout.write(`Injected back button: ${indexPath}\n`);
}

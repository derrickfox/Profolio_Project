// AI_CHANGE:
// Tool: Codex
// Model: GPT-6
// Timestamp: 2026-10-23T21:13:00-04:00
// Purpose: Publish a reviewed FretFlow Studio build while retaining every other live file and hosting setting.
// Reason: The portfolio checkout contains unrelated work that must not enter this app's release.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir, realpath, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('../', import.meta.url));
const recordArg = process.argv.indexOf('--record-dir');
if (recordArg < 0 || !process.argv[recordArg + 1]) throw new Error('Supply --record-dir <absolute directory> for the review plan and release receipt.');
const recordDir = path.resolve(process.argv[recordArg + 1]);
const project = 'portfolio-22855', site = 'portfolio-22855';
const prefix = '/apps/fretflow-studio/';
const href = 'https://fox-it-labs.com' + prefix + 'index.html';
const sha = data => createHash('sha256').update(data).digest('hex');
const changes = new Map(), appFiles = {};
async function inventory(dir, relative = '') {
  for (const item of (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    if (item.name.startsWith('.')) continue;
    if (item.isSymbolicLink()) throw new Error('Refusing symlink: ' + item.name);
    const local = path.join(dir, item.name), name = relative + item.name;
    if (item.isDirectory()) await inventory(local, name + '/');
    else if (item.isFile()) {
      const content = await readFile(local);
      appFiles[name] = sha(content);
      changes.set(prefix + name, content);
    }
  }
}
await inventory(path.join(root, 'public/apps/fretflow-studio'));
const index = changes.get(prefix + 'index.html')?.toString();
if (!index?.includes(prefix + 'assets/') || !index.includes('id="profolio-back"')) throw new Error('Build the complete mounted app with its Profolio link first.');
for (const match of index.matchAll(/(?:src|href)="(\/apps\/fretflow-studio\/assets\/[^\"]+)"/g)) {
  if (!changes.has(match[1])) throw new Error('Missing entry asset: ' + match[1]);
}
if (!appFiles['soundfont/sonivox.sf2'] || !Object.keys(appFiles).some(name => name.startsWith('preloaded/'))) throw new Error('Missing instrument soundfont or bundled songs.');

const cli = await realpath(execFileSync('which', ['firebase'], { encoding: 'utf8' }).trim());
const require = createRequire(cli), lib = path.resolve(path.dirname(cli), '..');
const auth = require(path.join(lib, 'auth.js')), api = require(path.join(lib, 'api.js'));
const scopes = require(path.join(lib, 'scopes.js')), hosting = require(path.join(lib, 'hosting/api.js'));
const { Client } = require(path.join(lib, 'apiv2.js'));
const account = auth.getProjectDefaultAccount(root);
if (!account) throw new Error('Sign in to Firebase before publishing.');
auth.setActiveAccount({}, account);
api.setScopes([scopes.CLOUD_PLATFORM]);
const client = new Client({ urlPrefix: api.hostingApiOrigin(), apiVersion: 'v1beta1', auth: true });
async function files(version) {
  const result = new Map();
  let pageToken = '';
  do {
    const response = await client.get('/' + version + '/files', { queryParams: { pageSize: 1000, ...(pageToken ? { pageToken } : {}) } });
    for (const file of response.body.files || []) result.set(file.path, file.hash);
    pageToken = response.body.nextPageToken || '';
  } while (pageToken);
  return result;
}
const previous = (await hosting.getChannel(project, site, 'live')).release.version.name;
const existing = await files(previous), config = (await client.get('/' + previous)).body.config;
if (!existing.has(prefix + 'index.html')) throw new Error('The selected hosting site does not contain the live app.');
const liveResponse = await fetch(href);
if (!liveResponse.ok || !(await liveResponse.text()).includes('<title>FretFlow Studio</title>')) throw new Error('The existing public app did not respond correctly.');
const preserved = new Map([...existing].filter(([name]) => !name.startsWith(prefix)));
const plan = { site, previous, href, configHash: sha(JSON.stringify(config)), appFiles, preservedFiles: preserved.size };
await mkdir(recordDir, { recursive: true });
if (!process.argv.includes('--execute')) {
  await writeFile(path.join(recordDir, 'plan.json'), JSON.stringify(plan, null, 2) + '\n');
  await writeFile(path.join(recordDir, 'previous-release.json'), JSON.stringify({ version: previous, config, files: Object.fromEntries(existing) }, null, 2) + '\n');
  console.log(JSON.stringify({ mode: 'preview', ...plan, appFiles: Object.keys(appFiles).length }, null, 2));
  process.exit(0);
}
const reviewed = JSON.parse(await readFile(path.join(recordDir, 'plan.json'), 'utf8'));
if (JSON.stringify(reviewed) !== JSON.stringify(plan)) throw new Error('Live release or local build changed; prepare and review a new plan.');
const replacement = {}, bodies = new Map();
for (const [name, content] of changes) {
  const body = gzipSync(content, { level: 9 }), hash = sha(body);
  replacement[name] = hash;
  bodies.set(hash, body);
}
const version = await hosting.createVersion(site, { config });
const manifest = Object.entries({ ...Object.fromEntries(preserved), ...replacement });
let uploadUrl = '', required = [];
for (let i = 0; i < manifest.length; i += 1000) {
  const response = await client.post('/' + version + ':populateFiles', { files: Object.fromEntries(manifest.slice(i, i + 1000)) });
  uploadUrl = response.body.uploadUrl;
  required.push(...(response.body.uploadRequiredHashes || []));
}
required = [...new Set(required)];
if (required.some(hash => !bodies.has(hash))) throw new Error('Unexpected request to upload unrelated live content.');
const uploader = new Client({ urlPrefix: uploadUrl, auth: true });
for (const hash of required) await uploader.request({ method: 'POST', path: '/' + hash, body: bodies.get(hash), headers: { 'Content-Type': 'application/octet-stream' } });
const next = await files(version);
if (next.size !== manifest.length) throw new Error('Release inventory size differs from the plan.');
for (const [name, hash] of manifest) if (next.get(name) !== hash) throw new Error('Release file failed verification: ' + name);
if (JSON.stringify((await client.get('/' + version)).body.config) !== JSON.stringify(config)) throw new Error('Hosting configuration changed.');
await hosting.updateVersion(site, version.split('/').at(-1), { status: 'FINALIZED' });
if ((await hosting.getChannel(project, site, 'live')).release.version.name !== previous) throw new Error('A concurrent release occurred; stopping.');
const release = await hosting.createRelease(site, 'live', version, { message: 'FretFlow Studio: layered scales, compact aligned necks, jazz/blues presets, gold roots, circle of fifths, and inline editing.' });
const receipt = { date: new Date().toISOString(), site, previous, version, release: release.name, href, appFiles: Object.keys(appFiles).length, uploadedFiles: required.length, preservedFiles: preserved.size };
await writeFile(path.join(recordDir, 'release.json'), JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify(receipt, null, 2));

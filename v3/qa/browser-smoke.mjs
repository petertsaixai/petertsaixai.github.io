import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const port = 4173;
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

function safePath(url) {
  const pathname = decodeURIComponent((url || '/').split('?')[0]);
  const relative = pathname.replace(/^\/+/, '');
  const candidate = normalize(join(root, relative || 'index.html'));
  if (!candidate.startsWith(root)) throw new Error('unsafe path');
  return candidate;
}

const server = createServer(async (req, res) => {
  try {
    let path = safePath(req.url);
    if (req.url?.endsWith('/')) path = join(path, 'index.html');
    const body = await readFile(path);
    res.writeHead(200, { 'content-type': mime[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

const listen = () => new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(port, '127.0.0.1', resolve);
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function checkViewport(browser, name, viewport) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', error => consoleErrors.push(error.message));

  await page.goto(`http://127.0.0.1:${port}/v3/prototype/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.journey-item');

  const actualViewport = await page.evaluate(() => ({ width: innerWidth, height: innerHeight }));
  assert(actualViewport.width === viewport.width && actualViewport.height === viewport.height,
    `${name}: requested ${viewport.width}x${viewport.height}, got ${actualViewport.width}x${actualViewport.height}`);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 1, `${name}: horizontal overflow detected (${overflow}px)`);

  const initialCount = await page.locator('.journey-item').count();
  assert(initialCount > 0, `${name}: no journey items rendered`);

  const skipBox = await page.locator('.skip-link').boundingBox();
  assert(skipBox && skipBox.y + skipBox.height <= 1, `${name}: skip link is visible before keyboard focus`);

  if (name === 'desktop') {
    assert(await page.locator('.context-panel').isVisible(), 'desktop: connected context panel is not visible');
    const position = await page.locator('.context-panel').evaluate(el => getComputedStyle(el).position);
    assert(position === 'sticky', `desktop: context panel should be sticky, got ${position}`);
    await page.locator('.journey-item').first().click();
    const active = await page.locator('.journey-item.is-active').count();
    assert(active === 1, `desktop: expected one active journey item, got ${active}`);
  } else {
    assert(!(await page.locator('.context-panel').isVisible()), 'mobile: desktop context panel should be hidden');
    await page.locator('.journey-item').first().click();
    assert(await page.locator('.journey-inline-context').isVisible(), 'mobile: inline connected context did not appear');
  }

  await mkdir('v3/qa/artifacts', { recursive: true });
  await page.screenshot({ path: `v3/qa/artifacts/${name}.png`, fullPage: true });

  const toggle = page.locator('#journey-mode');
  assert(await toggle.count() === 1, `${name}: progressive journey toggle is missing`);
  const before = await page.locator('.journey-item').count();
  await toggle.click();
  await page.waitForFunction(count => document.querySelectorAll('.journey-item').length > count, before);
  const after = await page.locator('.journey-item').count();
  assert(after > before, `${name}: full journey did not reveal additional milestones`);
  assert(await toggle.getAttribute('aria-expanded') === 'true', `${name}: journey toggle aria-expanded did not update`);

  assert(consoleErrors.length === 0, `${name}: browser console errors: ${consoleErrors.join(' | ')}`);
  await page.close();
}

await listen();
let browser;
try {
  browser = await chromium.launch({ headless: true });
  await checkViewport(browser, 'desktop', { width: 1440, height: 1000 });
  await checkViewport(browser, 'mobile', { width: 390, height: 844 });
  console.log('Browser smoke QA passed for desktop and mobile viewports.');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}

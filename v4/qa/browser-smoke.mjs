import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const port = 4174;
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png'};

function safePath(url){
  const pathname = decodeURIComponent((url || '/').split('?')[0]);
  const relative = pathname.replace(/^\/+/, '');
  const candidate = normalize(join(root, relative || 'index.html'));
  if (!candidate.startsWith(root)) throw new Error('unsafe path');
  return candidate;
}

const server = createServer(async (req,res) => {
  try {
    let path = safePath(req.url);
    if (req.url?.endsWith('/')) path = join(path,'index.html');
    const body = await readFile(path);
    res.writeHead(200,{'content-type':mime[extname(path)] || 'application/octet-stream'});
    res.end(body);
  } catch {
    res.writeHead(404,{'content-type':'text/plain; charset=utf-8'});
    res.end('Not found');
  }
});

const listen = () => new Promise((resolve,reject) => { server.once('error',reject); server.listen(port,'127.0.0.1',resolve); });
const assert = (condition,message) => { if (!condition) throw new Error(message); };

async function assertNoOverflow(page,name){
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 1, `${name}: horizontal overflow detected (${overflow}px)`);
}

async function checkDeepPage(page,path,selector,name){
  await page.goto(`http://127.0.0.1:${port}${path}`,{waitUntil:'networkidle'});
  await page.waitForSelector(selector);
  assert(await page.locator(selector).count() > 0, `${name}: no graph-backed cards rendered`);
  assert((await page.title()).includes('v4 Preview'), `${name}: preview title missing`);
  assertNoOverflow(page,name);
}

async function checkViewport(browser,name,viewport){
  const page = await browser.newPage({viewport,reducedMotion:'reduce'});
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', error => errors.push(error.message));

  await page.goto(`http://127.0.0.1:${port}/v4/prototype/`,{waitUntil:'networkidle'});
  await page.waitForSelector('.journey-item');
  await assertNoOverflow(page,`${name} overview`);

  assert(await page.locator('.site-nav').count() === 1, `${name}: full-site navigation missing`);
  assert(await page.locator('.story').count() === 1, `${name}: throughline section missing`);
  assert(await page.locator('.threads').count() === 1, `${name}: research map section missing`);
  assert(await page.locator('.selected-work').count() === 1, `${name}: selected work section missing`);
  assert(await page.locator('.direction').count() === 1, `${name}: current direction section missing`);

  const tabs = page.locator('.lens-tab');
  assert(await tabs.count() === 3, `${name}: expected three perspective lenses`);
  assert(await page.locator('.lens-tab[aria-selected="true"]').count() === 1, `${name}: expected exactly one selected lens`);

  const beforeFirst = await page.locator('.journey-item').first().textContent();
  await page.locator('[data-lens="technology"]').click();
  assert(await page.locator('[data-lens="technology"]').getAttribute('aria-selected') === 'true', `${name}: technology lens did not become selected`);
  const afterFirst = await page.locator('.journey-item').first().textContent();
  assert(beforeFirst !== afterFirst, `${name}: lens change did not alter journey priority`);

  if (name === 'desktop') {
    assert(await page.locator('.context-panel').isVisible(), 'desktop: context panel should be visible');
    assert(await page.locator('.context-panel').evaluate(el => getComputedStyle(el).position) === 'sticky', 'desktop: context panel should be sticky');
  } else {
    assert(!(await page.locator('.context-panel').isVisible()), 'mobile: desktop context panel should be hidden');
    await page.locator('.journey-item').first().click();
    assert(await page.locator('.inline-context').isVisible(), 'mobile: inline connected context missing');
  }

  const toggle = page.locator('#journey-mode');
  const focusedCount = await page.locator('.journey-item').count();
  await toggle.click();
  await page.waitForFunction(count => document.querySelectorAll('.journey-item').length > count, focusedCount);
  assert(await toggle.getAttribute('aria-expanded') === 'true', `${name}: journey expansion aria state incorrect`);

  await mkdir('v4/qa/artifacts',{recursive:true});
  await page.screenshot({path:`v4/qa/artifacts/${name}-overview.png`,fullPage:true});

  await checkDeepPage(page,'/v4/prototype/research.html','.deep-card',`${name} research`);
  await page.screenshot({path:`v4/qa/artifacts/${name}-research.png`,fullPage:true});
  await checkDeepPage(page,'/v4/prototype/work.html','.deep-card',`${name} work`);
  assert(await page.locator('.deep-links a').count() > 0, `${name} work: expected at least one evidence link`);
  await page.screenshot({path:`v4/qa/artifacts/${name}-work.png`,fullPage:true});

  assert(errors.length === 0, `${name}: browser console errors: ${errors.join(' | ')}`);
  await page.close();
}

await listen();
let browser;
try {
  browser = await chromium.launch({headless:true});
  await checkViewport(browser,'desktop',{width:1440,height:1000});
  await checkViewport(browser,'mobile',{width:390,height:844});
  console.log('PASS: v4 full-site browser smoke QA');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}

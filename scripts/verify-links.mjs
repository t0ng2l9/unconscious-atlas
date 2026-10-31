// Verify cross-linking on essays and both relation maps on /figures.
// Usage: node scripts/verify-links.mjs <port> <outDir>
import { writeFileSync } from 'node:fs'

const [, , portArg, outDir] = process.argv
const PORT = Number(portArg)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

class CDP {
  constructor(ws) {
    this.ws = ws
    this.id = 0
    this.pending = new Map()
    ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data)
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id)
        this.pending.delete(msg.id)
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)
      }
    })
  }
  send(method, params = {}) {
    const id = ++this.id
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }))
  }
}

const out = {}
let ok = false
try {
  let version
  for (let i = 0; i < 60; i++) {
    try {
      version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()
      break
    } catch {
      await sleep(250)
    }
  }
  if (!version) throw new Error('no devtools endpoint')
  const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json()
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true })
    ws.addEventListener('error', rej, { once: true })
  })
  const page = new CDP(ws)
  const errors = []
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data)
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails?.exception?.description)
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error')
      errors.push(m.params.args.map((a) => a.value ?? a.description ?? '').join(' '))
  })
  await page.send('Page.enable')
  await page.send('Runtime.enable')
  await page.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  const evalJs = async (expr) => {
    const r = await page.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'eval error')
    return r.result.value
  }

  // ---- essay cross-links ----
  await page.send('Page.navigate', { url: 'http://localhost:5183/essays/china' })
  await sleep(2200)
  out.essayLinks = await evalJs(`(() => {
    const body = document.querySelector('article');
    const links = [...body.querySelectorAll('p a[href^="/archive/"], p a[href^="/figures#"], p a[href^="/glossary"]')];
    const targets = {};
    for (const a of links) { const k = a.getAttribute('href').split('?')[0].replace(/#.*/,''); targets[k] = (targets[k]||0)+1; }
    return { count: links.length, distinct: Object.keys(targets).length, sample: links.slice(0,6).map(a=>a.textContent+'→'+a.getAttribute('href')) };
  })()`)

  // nested-link sanity: no <a> inside <a>
  out.nestedAnchors = await evalJs(`document.querySelectorAll('a a').length`)

  // ---- figures page: both maps ----
  await page.send('Page.navigate', { url: 'http://localhost:5183/figures' })
  await sleep(2600)
  out.mapNodes = await evalJs(`document.querySelectorAll('svg[aria-label="所有人物之间的关系网络"] g[role="link"], svg[aria-label="所有人物之间的关系网络"] g[role="note"]').length`)
  out.mapEdges = await evalJs(`document.querySelectorAll('svg[aria-label="所有人物之间的关系网络"] path').length`)
  out.singleMap = await evalJs(`!!document.querySelector('svg[aria-label$="的关系网络"]:not([aria-label="所有人物之间的关系网络"])')`)

  // hover a node in the overview map to confirm related-only highlighting
  const pos = await evalJs(`(() => {
    const svg = document.querySelector('svg[aria-label="所有人物之间的关系网络"]');
    const g = [...svg.querySelectorAll('g[role="link"]')].find(x => (x.getAttribute('aria-label')||'').startsWith('尼采'));
    if (!g) return null;
    g.scrollIntoView({block:'center', behavior:'instant'});
    const r = g.getBoundingClientRect();
    return { x: Math.round(r.left + r.width/2), y: Math.round(r.top + r.height/2) };
  })()`)
  if (pos) {
    await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pos.x, y: pos.y })
    await sleep(600)
    out.hoverOk = await evalJs(`(() => {
      const svg = document.querySelector('svg[aria-label="所有人物之间的关系网络"]');
      const live = [...document.querySelectorAll('span')].find(s => s.textContent.includes('条关系') && s.textContent.includes('尼采'));
      return live ? live.textContent.trim() : 'no readout';
    })()`)
  }

  // switch the single-figure map to 阿多诺 and count its nodes
  out.switchClick = await evalJs(`(() => {
    const btn = [...document.querySelectorAll('button[aria-pressed]')].find(b => b.textContent.trim().startsWith('阿多诺'));
    if (!btn) return 'button missing';
    btn.click();
    return 'clicked';
  })()`)
  // React commits state asynchronously — wait a frame before reading the DOM
  await sleep(800)
  out.centerAfterSwitch = await evalJs(`(() => {
    const svg = document.querySelector('svg[aria-label$="的关系网络"]:not([aria-label="所有人物之间的关系网络"])');
    return svg ? svg.getAttribute('aria-label') : 'single svg missing';
  })()`)
  out.singleNodes = await evalJs(`(() => {
    const svg = document.querySelector('svg[aria-label$="的关系网络"]:not([aria-label="所有人物之间的关系网络"])');
    return svg ? [...svg.querySelectorAll('g[role]')].map(g=>g.getAttribute('aria-label')).join(' | ') : null;
  })()`)

  const shot = await page.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
  writeFileSync(`${outDir}/g-figures-map.png`, Buffer.from(shot.data, 'base64'))

  // ---- anchor deep link ----
  await page.send('Page.navigate', { url: 'http://localhost:5183/figures#adorno' })
  await sleep(2600)
  out.anchorExpanded = await evalJs(`(() => {
    const li = document.getElementById('figure-adorno');
    if (!li) return 'card missing';
    const btn = li.querySelector('button[aria-expanded]');
    return btn ? btn.getAttribute('aria-expanded') : 'no toggle';
  })()`)

  // essay screenshot with links
  await page.send('Page.navigate', { url: 'http://localhost:5183/essays/china' })
  await sleep(2000)
  const s2 = await page.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
  writeFileSync(`${outDir}/g-essay-links.png`, Buffer.from(s2.data, 'base64'))

  out.errors = errors
  ok = true
} catch (err) {
  out.fatal = String(err && err.stack ? err.stack : err)
} finally {
  console.log(JSON.stringify({ ok, out }, null, 2))
  setTimeout(() => process.exit(ok ? 0 : 1), 150)
}

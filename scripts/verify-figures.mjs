// Expand the first figure card and verify its detail panel renders.
// Usage: node scripts/verify-figures.mjs <port> <outDir>
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

  await page.send('Page.navigate', { url: 'http://localhost:5183/figures' })
  await sleep(2500)

  out.cardCount = await evalJs(`document.querySelectorAll('article').length`)

  // click the "核心论点" toggle on the first card
  const pos = await evalJs(`(() => {
    const b = document.querySelector('article button[aria-expanded]');
    if (!b) return null;
    b.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = b.getBoundingClientRect();
    return { x: Math.round(r.left + r.width/2), y: Math.round(r.top + r.height/2) };
  })()`)
  out.toggleFound = Boolean(pos)
  if (pos) {
    await page.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: pos.x, y: pos.y, button: 'left', clickCount: 1 })
    await page.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pos.x, y: pos.y, button: 'left', clickCount: 1 })
    await sleep(700)
    out.expanded = await evalJs(`document.querySelector('article button[aria-expanded]')?.getAttribute('aria-expanded')`)
    out.panelText = await evalJs(`(() => {
      const p = document.querySelector('article [id^="figure-"]');
      return p ? (p.hidden ? 'HIDDEN' : p.textContent.replace(/\\s+/g,' ').trim().slice(0, 120)) : null;
    })()`)
    const s = await page.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
    writeFileSync(`${outDir}/f-figures-expanded.png`, Buffer.from(s.data, 'base64'))
  }

  // filter by line: 哲学
  const before = await evalJs(`document.querySelectorAll('article').length`)
  const fpos = await evalJs(`(() => {
    const b = [...document.querySelectorAll('button[aria-pressed]')].find(x => x.textContent.trim() === '哲学');
    if (!b) return null;
    b.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = b.getBoundingClientRect();
    return { x: Math.round(r.left + r.width/2), y: Math.round(r.top + r.height/2) };
  })()`)
  if (fpos) {
    await page.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: fpos.x, y: fpos.y, button: 'left', clickCount: 1 })
    await page.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: fpos.x, y: fpos.y, button: 'left', clickCount: 1 })
    await sleep(700)
    out.filterPhilosophy = `${before} -> ${await evalJs(`document.querySelectorAll('article').length`)}`
  }

  // archive shows 16 concepts now
  await page.send('Page.navigate', { url: 'http://localhost:5183/archive' })
  await sleep(1800)
  out.archiveCards = await evalJs(`document.querySelectorAll('a[href^="/archive/"] h3').length`)
  out.newConceptsPresent = await evalJs(
    `[...document.querySelectorAll('a[href^="/archive/"] h3')].map(h=>h.textContent).filter(t => ['欲望机器','意识形态','异化','性别的生产'].includes(t)).join(',')`,
  )

  out.errors = errors
  ok = true
} catch (err) {
  out.fatal = String(err && err.stack ? err.stack : err)
} finally {
  console.log(JSON.stringify({ ok, out }, null, 2))
  setTimeout(() => process.exit(ok ? 0 : 1), 150)
}

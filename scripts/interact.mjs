// Drive real interactions via CDP: hover a trace node, click it, and click a
// relation-graph node, capturing the resulting URL and screenshots.
// Usage: node scripts/interact.mjs <port> <outDir>
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

const results = {}
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
  const shot = async (name) => {
    const s = await page.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
    writeFileSync(`${outDir}/${name}.png`, Buffer.from(s.data, 'base64'))
  }
  const centerOf = (sel) =>
    evalJs(`(() => {
      const el = document.querySelector(${JSON.stringify(sel)});
      if (!el) return null;
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
    })()`)

  await page.send('Page.navigate', { url: 'http://localhost:5183/' })
  await sleep(2600)

  // 1) hover a trace node (the 'dream' node is not on home; use 'other' / 大他者)
  const traceNode = await centerOf('svg[aria-label^="无意识图谱"] g[role="link"][aria-label*="大他者"]')
  results.traceNodeFound = Boolean(traceNode)
  if (traceNode) {
    await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: traceNode.x, y: traceNode.y })
    await sleep(900)
    results.hoverReadout = await evalJs(
      `(() => { const el = document.querySelector('svg[aria-label^="无意识图谱"]').parentElement.querySelector('a[tabindex="-1"]'); return el ? el.textContent.replace(/\\s+/g,' ').trim().slice(0,80) : null })()`,
    )
    await shot('i1-trace-hover')
  }

  // 2) click the trace node -> should route to /archive/other
  if (traceNode) {
    await page.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: traceNode.x, y: traceNode.y, button: 'left', clickCount: 1 })
    await page.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: traceNode.x, y: traceNode.y, button: 'left', clickCount: 1 })
    await sleep(1200)
    results.afterTraceClick = await evalJs('location.pathname')
    await shot('i2-concept-after-trace-click')
  }

  // 3) relation graph on that concept page: hover a neighbour node
  const relTitle = await evalJs(`document.querySelector('svg[role="group"][aria-label*="关联概念图"]') ? 'present' : 'missing'`)
  results.relationGraph = relTitle
  const relNode = await centerOf('svg[role="group"][aria-label*="关联概念图"] g[role="link"]')
  if (relNode) {
    await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: relNode.x, y: relNode.y })
    await sleep(900)
    results.relHover = await evalJs(
      `(() => { const live = document.querySelector('[aria-live="polite"]'); return live ? live.textContent.replace(/\\s+/g,' ').trim().slice(0,100) : null })()`,
    )
    await shot('i3-relation-hover')
    await page.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: relNode.x, y: relNode.y, button: 'left', clickCount: 1 })
    await page.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: relNode.x, y: relNode.y, button: 'left', clickCount: 1 })
    await sleep(1200)
    results.afterRelClick = await evalJs('location.pathname')
  }

  // 4) archive sort toggle
  await page.send('Page.navigate', { url: 'http://localhost:5183/archive' })
  await sleep(2000)
  const sortBtn = await centerOf('button[aria-pressed][aria-label], [role="group"][aria-label="排序方式"] button:nth-child(2)')
  if (sortBtn) {
    await page.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: sortBtn.x, y: sortBtn.y, button: 'left', clickCount: 1 })
    await page.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: sortBtn.x, y: sortBtn.y, button: 'left', clickCount: 1 })
    await sleep(1200)
    results.sortQuery = await evalJs('location.search')
    results.firstCards = await evalJs(
      `[...document.querySelectorAll('a[href^="/archive/"] h3')].slice(0,4).map(h => h.textContent).join(' / ')`,
    )
    await shot('i4-archive-sorted')
  }

  results.errors = errors
  ok = true
} catch (err) {
  results.fatal = String(err && err.stack ? err.stack : err)
} finally {
  console.log(JSON.stringify({ ok, results }, null, 2))
  setTimeout(() => process.exit(ok ? 0 : 1), 150)
}

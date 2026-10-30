// CDP screenshot driver. Chrome is already running with --remote-debugging-port.
// Usage: node scripts/shot.mjs <url> <out.png> [scrollY] [width] [height] [port]
import { writeFileSync } from 'node:fs'

const [, , url, out, scrollYArg = '0', widthArg = '1440', heightArg = '1000', portArg = '9333'] = process.argv
const scrollY = Number(scrollYArg)
const width = Number(widthArg)
const height = Number(heightArg)
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
  if (!version) throw new Error('devtools endpoint did not start')

  const target = await (
    await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })
  ).json()
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true })
    ws.addEventListener('error', rej, { once: true })
  })
  const page = new CDP(ws)

  const errors = []
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data)
    if (msg.method === 'Runtime.exceptionThrown') {
      errors.push(msg.params.exceptionDetails?.exception?.description || 'exception')
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      errors.push(msg.params.args.map((a) => a.value ?? a.description ?? '').join(' '))
    }
  })

  await page.send('Page.enable')
  await page.send('Runtime.enable')
  await page.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 700,
  })
  await page.send('Page.navigate', { url })
  await sleep(2400)

  // optional JS eval before capture: EVAL=<expression>
  if (process.env.EVAL) {
    const res = await page.send('Runtime.evaluate', {
      expression: process.env.EVAL,
      awaitPromise: true,
      returnByValue: true,
    })
    console.log('EVAL_RESULT ' + JSON.stringify(res.result && res.result.value))
    await sleep(600)
  }

  if (scrollY === -1) {
    // scroll to the very bottom so scroll-linked content is fully revealed
    await page.send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight)' })
    await sleep(1600)
    await page.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' })
    await sleep(600)
  } else if (scrollY > 0) {
    await page.send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${scrollY}, behavior: 'instant' })`,
    })
    await sleep(1700)
    await page.send('Runtime.evaluate', { expression: 'window.scrollTo({ top: ${scrollY}, behavior: "instant" })' })
    await sleep(400)
  }

  if (scrollY === -2) {
    // viewport capture at the bottom (no layout change => scroll state preserved)
    await page.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' })
    await sleep(500)
    await page.send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight)' })
    await sleep(1500)
    const shot = await page.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
    writeFileSync(out, Buffer.from(shot.data, 'base64'))
    console.log(JSON.stringify({ ok: true, out, mode: 'bottom-viewport', errors }))
    ok = true
    throw { handled: true }
  }

  if (scrollY === -3) {
    // keep the viewport size (resizing it re-runs scroll measurement) and jump
    // to the trace figure using an in-page expression
    await page.send('Runtime.evaluate', {
      expression: `
        const fig = document.querySelector('svg[aria-label]');
        if (fig) window.scrollTo(0, fig.getBoundingClientRect().top + window.scrollY - 300);
      `,
    })
    await sleep(1600)
    const shot = await page.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
    writeFileSync(out, Buffer.from(shot.data, 'base64'))
    const info = await page.send('Runtime.evaluate', {
      expression: `(() => scrollY + ' | ' + [...document.querySelectorAll('svg[aria-label] path')].map(p => getComputedStyle(p).strokeDashoffset).join(','))()`,
      returnByValue: true,
    })
    console.log(JSON.stringify({ ok: true, out, mode: 'trace-viewport', state: info.result.value, errors }))
    ok = true
    throw { handled: true }
  }

  const metrics = await page.send('Page.getLayoutMetrics')
  const fullHeight = Math.min(Math.ceil(metrics.cssContentSize.height), 14000)
  await page.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: fullHeight,
    deviceScaleFactor: 1,
    mobile: width < 700,
  })
  await sleep(800)
  const shot = await page.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    fromSurface: true,
  })
  writeFileSync(out, Buffer.from(shot.data, 'base64'))
  console.log(JSON.stringify({ ok: true, out, height: fullHeight, errors }))
  ok = true
} catch (err) {
  if (!(err && err.handled)) {
    console.log(JSON.stringify({ ok: false, error: String(err && err.stack ? err.stack : err) }))
  }
} finally {
  setTimeout(() => process.exit(ok ? 0 : 1), 150)
}

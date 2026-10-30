param(
  [string]$Script = "interact.mjs"
)
$ErrorActionPreference = 'Stop'
$chrome = "C:\Users\刘\AppData\Local\ms-playwright\chromium-1248\chrome-win64\chrome.exe"
$node = "C:\Users\刘\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe"
$proj = "C:\Users\刘\Documents\deepseek-harness\default-workspace\unconscious-atlas"
$out = Join-Path $proj ".shots"
New-Item -ItemType Directory -Force -Path $out | Out-Null
$port = 9400 + (Get-Random -Minimum 0 -Maximum 90)
$tmp = Join-Path $env:TEMP "cdp-int-$port"
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
$p = Start-Process -FilePath $chrome -ArgumentList @(
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  "--remote-debugging-port=$port", "--user-data-dir=$tmp",
  "--no-first-run", "--no-default-browser-check", "about:blank"
) -PassThru -RedirectStandardError (Join-Path $env:TEMP "chrome-int-$port.txt")
Start-Sleep -Seconds 5
& $node (Join-Path $proj "scripts" $Script) $port $out
Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue

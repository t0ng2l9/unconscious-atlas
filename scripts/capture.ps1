param(
  [string]$Url,
  [string]$Out,
  [string]$Mode = "0",
  [int]$Width = 1440,
  [int]$Height = 1000
)
$ErrorActionPreference = 'Stop'
$chrome = "C:\Users\刘\AppData\Local\ms-playwright\chromium-1248\chrome-win64\chrome.exe"
$node = "C:\Users\刘\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe"
$proj = "C:\Users\刘\Documents\deepseek-harness\default-workspace\unconscious-atlas"
$port = 9200 + (Get-Random -Minimum 0 -Maximum 90)
$tmp = Join-Path $env:TEMP "cdp-cap-$port"
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
$p = Start-Process -FilePath $chrome -ArgumentList @(
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  "--remote-debugging-port=$port", "--user-data-dir=$tmp",
  "--no-first-run", "--no-default-browser-check", "about:blank"
) -PassThru -RedirectStandardError (Join-Path $env:TEMP "chrome-$port.txt")
Start-Sleep -Seconds 5
& $node "$proj\scripts\shot.mjs" $Url $Out $Mode $Width $Height $port
Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue

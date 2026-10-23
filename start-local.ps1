$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$portfolioNode = Get-Command node -ErrorAction SilentlyContinue
if ($portfolioNode) {
    $portfolioNodePath = $portfolioNode.Source
} else {
    $portfolioNodePath = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
}
if (-not (Test-Path -LiteralPath $portfolioNodePath)) {
    throw 'Install Node.js 24 LTS, then run pnpm install and pnpm dev.'
}
if (-not (Test-Path -LiteralPath 'node_modules\next\dist\bin\next')) {
    throw 'Dependencies are missing. Run pnpm install --frozen-lockfile first. See README.md.'
}
& $portfolioNodePath 'node_modules\next\dist\bin\next' dev --hostname 127.0.0.1

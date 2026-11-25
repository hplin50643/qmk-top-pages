@echo off
cd /d "%~dp0"
where node.exe >nul 2>nul
if not errorlevel 1 (
  node Start-Driver.cjs --open
  if errorlevel 1 pause
  exit /b
)
where py.exe >nul 2>nul
if not errorlevel 1 (
  start "" "http://127.0.0.1:8765/"
  py -3 -m http.server 8765 --bind 127.0.0.1
  if errorlevel 1 pause
  exit /b
)
for /f "delims=" %%N in ('powershell.exe -NoProfile -Command "Get-AppxPackage 'OpenAI.CodexPrimaryRuntime*' | Sort-Object Version -Descending | ForEach-Object { Join-Path $_.InstallLocation 'dependencies\node\bin\node.exe' } | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1"') do (
  "%%N" Start-Driver.cjs --open
  if errorlevel 1 pause
  exit /b
)
echo Install Node.js or Python 3 to run the local driver.
pause
exit /b 1

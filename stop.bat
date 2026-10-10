@echo off
REM Stops the local Django and Vite dev servers.
echo Stopping Tiny Turners dev servers...

REM Vite / node processes
taskkill /f /im node.exe >nul 2>&1

REM Django dev server (venv python only)
for /f "tokens=2" %%p in ('wmic process where "name='python.exe'" get processid^,executablepath /format:csv 2^>nul ^| find "TINY TURNNER"') do (
  taskkill /f /pid %%p >nul 2>&1
)

echo Done. You can close the remaining console windows.
timeout /t 2 >nul
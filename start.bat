@echo off
REM ==========================================================
REM  Tiny Turners — start both servers for local development
REM  Backend  : http://127.0.0.1:8000   (Django)
REM  Frontend : http://localhost:5173    (Vite)
REM ==========================================================
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
  echo [1/4] Creating Python virtual environment...
  python -m venv .venv
)

echo [2/4] Installing Python dependencies...
".venv\Scripts\python.exe" -m pip install -q -r backend\requirements.txt

if not exist "frontend\node_modules" (
  echo [3/4] Installing frontend dependencies...
  pushd frontend
  call npm.cmd install
  popd
)

echo [4/4] Applying database migrations...
".venv\Scripts\python.exe" backend\manage.py migrate --noinput

echo.
echo Starting Django on port 8000...
start "Tiny Turners API" cmd /k "cd /d "%~dp0backend" && "..\.venv\Scripts\python.exe" manage.py runserver 8000"

echo Starting Vite on port 5173...
start "Tiny Turners Web" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

echo.
echo ==========================================================
echo  Website  : http://localhost:5173
echo  Django admin : http://127.0.0.1:8000/admin/
echo  Admissions dashboard : http://localhost:5173/admin
echo  Login: admin / school@123
echo ==========================================================
echo.
start "" http://localhost:5173
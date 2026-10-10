@echo off
REM ==============================================================
REM  Build the React frontend and publish it to Firebase Hosting
REM ==============================================================
setlocal
cd /d "%~dp0"

echo.
echo [1/3] Building frontend...
pushd frontend
call npm.cmd run build
if errorlevel 1 ( echo BUILD FAILED & popd & exit /b 1 )
popd

echo.
echo [2/3] Deploying to Firebase Hosting...
call firebase.cmd deploy --only hosting --project tiny-turners-school
if errorlevel 1 (
  echo.
  echo Deploy failed. If you see a Cloud Run API error, that means you
  echo switched to firebase.json.with-api before the backend is live.
  echo Restore firebase.json and try again.
  exit /b 1
)

echo.
echo [3/3] Done.
echo ---------------------------------------------------------
echo   Website : https://tiny-turners-school.web.app
echo ---------------------------------------------------------
echo.
start "" "https://tiny-turners-school.web.app"
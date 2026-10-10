@echo off
REM ==============================================================
REM  Tiny Turners — install the admission poster (splash screen)
REM
REM  Easiest way: DRAG your poster image onto this .bat file.
REM  It will be resized + compressed and placed in the website.
REM ==============================================================
setlocal enabledelayedexpansion

set "PYTHON=%~dp0.venv\Scripts\python.exe"
set "SCRIPT=%~dp0set_poster.py"
set "TARGET=%~dp0frontend\public\images\admission-poster.jpg"

if "%~1"=="" (
  echo.
  echo  DRAG your admission poster image onto this file.
  echo  Or type the full path below and press Enter.
  echo.
  set /p "SRC=Path: "
) else (
  set "SRC=%~1"
)

if not exist "%PYTHON%" (
  echo ERROR: virtual environment not found at %PYTHON%
  pause
  exit /b 1
)

if not exist "%SRC%" (
  echo.
  echo ERROR: could not find that file:
  echo        %SRC%
  echo.
  pause
  exit /b 1
)

echo.
"%PYTHON%" "%SCRIPT%" "%SRC%" "%TARGET%"

echo.
echo --------------------------------------------------------
echo  Done. Refresh the website to see your poster.
echo --------------------------------------------------------
pause
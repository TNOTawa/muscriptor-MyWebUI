@echo off
setlocal
cd /d "%~dp0web"

echo Building MuScriptor Web UI...
pnpm run build

if %ERRORLEVEL% neq 0 (
    echo Build failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Build completed successfully.
echo Output: muscriptor\web_dist\
echo Restart start.bat if the server was already running.
endlocal

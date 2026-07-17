@echo off
setlocal
cd /d "%~dp0"

set TMP=F:\MuScriptor\tmp
set TEMP=F:\MuScriptor\tmp
if not exist "%TMP%" mkdir "%TMP%"

echo Starting MuScriptor Web UI (large / CUDA) ...
echo Open http://127.0.0.1:8222 in your browser

.venv\Scripts\python.exe -m muscriptor serve --model models/muscriptor-large/model.safetensors --device cuda --host 0.0.0.0 --port 8222

endlocal

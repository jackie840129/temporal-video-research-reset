@echo off
start "Temporal Video Research Navigator" powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-localhost.ps1" -Port 8124
timeout /t 2 /nobreak >nul
start "" http://127.0.0.1:8124/

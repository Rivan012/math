@echo off
setlocal EnableDelayedExpansion
title TIME QUEST - Server Edukasi Matematika

echo ================================================================
echo           TIME QUEST - MEDIA PEMBELAJARAN WAKTU ^& JAM
echo               Sekolah Dasar (Kurikulum Merdeka)
echo ================================================================
echo.

:: 1. Cek apakah node sudah ada di PATH sistem
where node >nul 2>&1
if %errorlevel% equ 0 goto NODE_READY

:: 2. Cek lokasi instalasi standar jika belum masuk PATH
if exist "%ProgramFiles%\nodejs\node.exe" (
    set "PATH=%ProgramFiles%\nodejs;!PATH!"
    goto NODE_READY
)
if exist "%ProgramFiles(x86)%\nodejs\node.exe" (
    set "PATH=%ProgramFiles(x86)%\nodejs;!PATH!"
    goto NODE_READY
)
if exist "%LocalAppData%\Programs\nodejs\node.exe" (
    set "PATH=%LocalAppData%\Programs\nodejs;!PATH!"
    goto NODE_READY
)
if exist "%~dp0tools\nodejs\node.exe" (
    set "PATH=%~dp0tools\nodejs;!PATH!"
    goto NODE_READY
)

:: 3. Jika belum terpasang, mulai proses unduh dan pasang otomatis
echo [INFO] Node.js belum terdeteksi di komputer ini.
echo [INFO] Menyiapkan pemasangan otomatis Node.js LTS...
echo.

:: Deteksi Arsitektur Windows (64-bit atau 32-bit)
set "NODE_ARCH=x64"
if "%PROCESSOR_ARCHITECTURE%"=="x86" (
    if not defined PROCESSOR_ARCHITEW6432 set "NODE_ARCH=x86"
)

set "NODE_VER=v20.18.0"
set "MSI_URL=https://nodejs.org/dist/%NODE_VER%/node-%NODE_VER%-%NODE_ARCH%.msi"
set "MSI_FILE=%TEMP%\nodejs_installer_%NODE_VER%_%NODE_ARCH%.msi"

echo [1/3] Mengunduh installer resmi Node.js (%NODE_VER% %NODE_ARCH%)...
echo       Sumber: %MSI_URL%
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ProgressPreference = 'SilentlyContinue'; " ^
    "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; " ^
    "try { " ^
    "    Invoke-WebRequest -Uri '%MSI_URL%' -OutFile '%MSI_FILE%' -UseBasicParsing; " ^
    "    exit 0; " ^
    "} catch { " ^
    "    Write-Host '[ERROR] Gagal mengunduh:' $_.Exception.Message -ForegroundColor Red; " ^
    "    exit 1; " ^
    "}"

if %errorlevel% neq 0 (
    echo.
    echo [PERINGATAN] Gagal mengunduh installer MSI. Mencoba opsi alternatif portable (ZIP)...
    goto INSTALL_PORTABLE_FALLBACK
)

echo [2/3] Memasang Node.js ke sistem (jika muncul jendela persetujuan, klik Yes/Ya)...
echo       Harap tunggu hingga proses selesai...
msiexec /i "%MSI_FILE%" /passive /norestart

:: Cek kembali setelah instalasi MSI
if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;!PATH!"
if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "PATH=%ProgramFiles(x86)%\nodejs;!PATH!"
if exist "%LocalAppData%\Programs\nodejs\node.exe" set "PATH=%LocalAppData%\Programs\nodejs;!PATH!"

where node >nul 2>&1
if %errorlevel% equ 0 goto NODE_INSTALLED_SUCCESS

:INSTALL_PORTABLE_FALLBACK
echo.
echo [INFO] Memasang Node.js versi portable mandiri (tanpa perlu hak administrator)...
set "ZIP_URL=https://nodejs.org/dist/%NODE_VER%/node-%NODE_VER%-win-%NODE_ARCH%.zip"
set "ZIP_FILE=%TEMP%\nodejs_portable_%NODE_VER%_%NODE_ARCH%.zip"
set "TOOLS_DIR=%~dp0tools\nodejs"

if not exist "%~dp0tools" mkdir "%~dp0tools"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ProgressPreference = 'SilentlyContinue'; " ^
    "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; " ^
    "Write-Host 'Mengunduh Node.js Portable...'; " ^
    "Invoke-WebRequest -Uri '%ZIP_URL%' -OutFile '%ZIP_FILE%' -UseBasicParsing; " ^
    "Write-Host 'Mengekstrak berkas Node.js...'; " ^
    "$extractDir = [System.IO.Path]::Combine($env:TEMP, 'node_extract_tmp'); " ^
    "if (Test-Path $extractDir) { Remove-Item -Path $extractDir -Recurse -Force }; " ^
    "Expand-Archive -Path '%ZIP_FILE%' -DestinationPath $extractDir -Force; " ^
    "$subFolder = Get-ChildItem -Path $extractDir | Where-Object { $_.PSIsContainer } | Select-Object -First 1; " ^
    "if (Test-Path '%TOOLS_DIR%') { Remove-Item -Path '%TOOLS_DIR%' -Recurse -Force }; " ^
    "Move-Item -Path $subFolder.FullName -Destination '%TOOLS_DIR%'; " ^
    "Remove-Item -Path $extractDir -Recurse -Force -ErrorAction SilentlyContinue; " ^
    "Remove-Item -Path '%ZIP_FILE%' -Force -ErrorAction SilentlyContinue; " ^
    "exit 0;"

if exist "%TOOLS_DIR%\node.exe" (
    set "PATH=%TOOLS_DIR%;!PATH!"
    goto NODE_INSTALLED_SUCCESS
)

echo.
echo [GAGAL] Tidak dapat memasang Node.js secara otomatis.
echo Silakan unduh dan pasang Node.js manual dari: https://nodejs.org
echo.
pause
exit /b 1

:NODE_INSTALLED_SUCCESS
echo.
echo [SUKSES] Node.js berhasil dipasang dan siap digunakan!
echo.

:NODE_READY
echo [OK] Node.js terdeteksi:
for /f "tokens=*" %%v in ('node -v 2^>nul') do echo      Versi: %%v
echo.
echo Menjalankan server aplikasi Time Quest...
echo Tekan [Ctrl + C] di jendela ini untuk menghentikan server.
echo ================================================================
echo.

:: Buka browser secara otomatis setelah jeda singkat 1.5 detik
start "" powershell -NoProfile -Command "Start-Sleep -Milliseconds 1500; Start-Process 'http://localhost:3000'"

:: Jalankan server backend Node.js
node server.js

if %errorlevel% neq 0 (
    echo.
    echo Server terhenti atau terjadi kesalahan.
)

pause


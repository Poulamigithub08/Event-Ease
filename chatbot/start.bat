@echo off
REM ─────────────────────────────────────────────
REM  EventEase Chatbot — Windows Start Script
REM  Double-click this file OR run: start.bat
REM ─────────────────────────────────────────────

echo.
echo  EventEase Chatbot Starting...
echo ────────────────────────────────
echo.

REM ── Step 1: Check Python ──────────────────────
python --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo [ERROR] Python is not installed or not in PATH.
    echo         Download from: https://www.python.org/downloads/
    echo         IMPORTANT: Check "Add Python to PATH" during install!
    pause
    exit /b 1
)
echo [OK] Python found

REM ── Step 2: Check Ollama ──────────────────────
ollama --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo [ERROR] Ollama is not installed.
    echo         Download from: https://ollama.com/download/windows
    echo         Install it, then re-run this script.
    pause
    exit /b 1
)
echo [OK] Ollama found

REM ── Step 3: Create venv if missing ───────────
IF NOT EXIST "venv\" (
    echo [INFO] Creating virtual environment...
    python -m venv venv
    echo [OK] Virtual environment created
)

REM ── Step 4: Activate venv ────────────────────
call venv\Scripts\activate.bat
echo [OK] Virtual environment activated

REM ── Step 5: Install dependencies ─────────────
echo [INFO] Installing Python packages...
pip install -q -r requirements.txt
echo [OK] Packages installed

REM ── Step 6: Start Ollama serve in background ─
REM  On Windows, Ollama runs as a background service automatically after install.
REM  If it's not running, start it:
tasklist /FI "IMAGENAME eq ollama.exe" 2>nul | find /I "ollama.exe" >nul
IF ERRORLEVEL 1 (
    echo [INFO] Starting Ollama service...
    start /B ollama serve
    timeout /t 4 /nobreak >nul
)
echo [OK] Ollama service running

REM ── Step 7: Pull phi3:mini if not present ──────
ollama list 2>nul | find "gemma3:latest" >nul
IF ERRORLEVEL 1 (
    @REM echo [INFO] Downloading phi3:mini model (first time only, ~4 GB)...
    @REM echo        This may take several minutes depending on your internet speed.
    ollama pull gemma3:latest
    echo [OK] Model downloaded
) ELSE (
    echo [OK] gemma3:latest model ready
)

REM ── Step 8: Start FastAPI ─────────────────────
echo.
echo  Chatbot API starting on http://localhost:8000
echo  Open your browser to test: http://localhost:8000/health
echo  Press Ctrl+C to stop
echo.
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

pause

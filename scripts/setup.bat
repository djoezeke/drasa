@echo off
echo ============================================
echo Drasa Setup Script for Windows
echo ============================================
echo.

echo [1/4] Setting up Backend...
cd backend

echo Creating virtual environment...
uv venv

echo Running migrations...
uv run manage.py makemigrations
uv run manage.py migrate

echo.
echo ============================================
echo [2/4] Creating superuser for admin access
echo ============================================
echo Please create an admin account:
uv run manage.py createsuperuser

cd ..

echo.
echo [3/4] Setting up Frontend...
cd frontend

echo Installing dependencies...
call npm install

cd ..

echo.
echo ============================================
echo [4/4] Setup Complete!
echo ============================================
echo.
echo To start the application:
echo.
echo Backend (Terminal 1):
echo   cd backend
echo   venv\Scripts\activate
echo   uv run manage.py runserver
echo.
echo Frontend (Terminal 2):
echo   cd frontend
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo Admin panel: http://localhost:8000/admin
echo.
echo ============================================

pause

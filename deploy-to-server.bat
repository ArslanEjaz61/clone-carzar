@echo off
echo ========================================
echo   CarZar - Server Deployment Script
echo ========================================
echo.

echo Connecting to server: 72.60.43.202
echo You will be prompted for password: Arham@810000
echo.

ssh root@72.60.43.202 "cd /root/clone-carzar && echo '1. Pulling latest code...' && git pull origin main && echo '2. Installing server dependencies...' && cd server && npm install && echo '3. Installing client dependencies...' && cd ../client && npm install && echo '4. Restarting PM2 services...' && cd .. && pm2 restart all && echo 'Deployment Complete!' && pm2 status"

echo.
echo ========================================
echo   Deployment finished!
echo ========================================
pause

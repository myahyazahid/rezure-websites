@echo off
echo Deploying rezure_websites to VPS...
ssh root@202.10.48.147 "cd /var/www/rezure-websites && git pull && npm run docs:build"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Deploy FAILED - see output above.
) else (
    echo.
    echo Deploy done. Live at https://rezure.redscale.my.id
)

pause

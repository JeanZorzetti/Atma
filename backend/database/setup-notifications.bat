@echo off
echo ========================================
echo  Atma Notification System Setup
echo ========================================
echo.

REM Get database credentials
set /p DB_HOST="MySQL Host [localhost]: " || set DB_HOST=localhost
set /p DB_PORT="MySQL Port [3306]: " || set DB_PORT=3306
set /p DB_NAME="Database Name [atmadb]: " || set DB_NAME=atmadb
set /p DB_USER="Database User [root]: " || set DB_USER=root
set /p DB_PASS="Database Password: "

echo.
echo ========================================
echo Step 1: Creating notification tables...
echo ========================================
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% %DB_NAME% < migrations\create_notification_tables.sql

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to create tables!
    pause
    exit /b 1
)

echo [SUCCESS] Tables created!
echo.

echo ========================================
echo Step 2: Inserting email templates...
echo ========================================
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% %DB_NAME% < migrations\add_notification_email_templates.sql

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to insert templates!
    pause
    exit /b 1
)

echo [SUCCESS] Email templates inserted!
echo.

echo ========================================
echo Step 3: Verifying installation...
echo ========================================
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% %DB_NAME% -e "SELECT COUNT(*) as tables_created FROM information_schema.tables WHERE table_schema='%DB_NAME%' AND table_name IN ('email_templates', 'notification_log', 'system_settings');"

mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% %DB_NAME% -e "SELECT COUNT(*) as templates_count FROM email_templates WHERE is_active=1;"

mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% %DB_NAME% -e "SELECT COUNT(*) as settings_count FROM system_settings WHERE category='notifications';"

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure .env file with SMTP credentials
echo 2. Update admin_email in system_settings table
echo 3. Restart the backend server
echo 4. Test with: POST /api/notifications/test
echo.
echo Full documentation: Backend\docs\NOTIFICATION_SYSTEM.md
echo.
pause

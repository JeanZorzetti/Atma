#!/bin/bash

echo "========================================"
echo " Atma Notification System Setup"
echo "========================================"
echo

# Get database credentials
read -p "MySQL Host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "MySQL Port [3306]: " DB_PORT
DB_PORT=${DB_PORT:-3306}

read -p "Database Name [atmadb]: " DB_NAME
DB_NAME=${DB_NAME:-atmadb}

read -p "Database User [root]: " DB_USER
DB_USER=${DB_USER:-root}

read -sp "Database Password: " DB_PASS
echo

echo
echo "========================================"
echo "Step 1: Creating notification tables..."
echo "========================================"
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < migrations/create_notification_tables.sql

if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to create tables!"
    exit 1
fi

echo "[SUCCESS] Tables created!"
echo

echo "========================================"
echo "Step 2: Inserting email templates..."
echo "========================================"
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < migrations/add_notification_email_templates.sql

if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to insert templates!"
    exit 1
fi

echo "[SUCCESS] Email templates inserted!"
echo

echo "========================================"
echo "Step 3: Verifying installation..."
echo "========================================"
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SELECT COUNT(*) as tables_created FROM information_schema.tables WHERE table_schema='$DB_NAME' AND table_name IN ('email_templates', 'notification_log', 'system_settings');"

mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SELECT COUNT(*) as templates_count FROM email_templates WHERE is_active=1;"

mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SELECT COUNT(*) as settings_count FROM system_settings WHERE category='notifications';"

echo
echo "========================================"
echo " Setup Complete!"
echo "========================================"
echo
echo "Next steps:"
echo "1. Configure .env file with SMTP credentials"
echo "2. Update admin_email in system_settings table"
echo "3. Restart the backend server"
echo "4. Test with: POST /api/notifications/test"
echo
echo "Full documentation: Backend/docs/NOTIFICATION_SYSTEM.md"
echo

#!/bin/bash

# Скрипт мониторинга для naidizakupku.ru
# Сохранить как /usr/local/bin/naidizakupku-monitor.sh

APP_NAME="naidizakupku-front"
LOG_FILE="/var/log/naidizakupku/monitor.log"
TELEGRAM_BOT_TOKEN="YOUR_TELEGRAM_BOT_TOKEN"
TELEGRAM_CHAT_ID="YOUR_TELEGRAM_CHAT_ID"

# Создаем директорию для логов если не существует
sudo mkdir -p /var/log/naidizakupku
sudo chown naidizakupku:naidizakupku /var/log/naidizakupku

# Функция отправки уведомления в Telegram
send_telegram_notification() {
    local message="$1"
    if [[ -n "$TELEGRAM_BOT_TOKEN" && -n "$TELEGRAM_CHAT_ID" ]]; then
        curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
            -d chat_id="${TELEGRAM_CHAT_ID}" \
            -d text="🚨 naidizakupku.ru: ${message}"
    fi
}

# Проверяем статус приложения
check_app_status() {
    local status=$(sudo -u naidizakupku pm2 describe $APP_NAME 2>/dev/null | grep "status" | head -1)
    
    if [[ $status == *"online"* ]]; then
        echo "$(date): App is running" >> $LOG_FILE
        return 0
    else
        echo "$(date): App is not running, attempting restart" >> $LOG_FILE
        sudo -u naidizakupku pm2 restart $APP_NAME
        send_telegram_notification "Приложение было перезапущено"
        return 1
    fi
}

# Проверяем доступность сайта
check_website() {
    local response=$(curl -s -o /dev/null -w "%{http_code}" https://naidizakupku.ru)
    
    if [[ $response == "200" ]]; then
        echo "$(date): Website is accessible" >> $LOG_FILE
        return 0
    else
        echo "$(date): Website returned $response" >> $LOG_FILE
        send_telegram_notification "Сайт недоступен (HTTP $response)"
        return 1
    fi
}

# Проверяем использование диска
check_disk_usage() {
    local usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [[ $usage -gt 85 ]]; then
        echo "$(date): Disk usage is high: ${usage}%" >> $LOG_FILE
        send_telegram_notification "Высокое использование диска: ${usage}%"
    fi
}

# Проверяем использование памяти
check_memory_usage() {
    local usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    
    if [[ $usage -gt 85 ]]; then
        echo "$(date): Memory usage is high: ${usage}%" >> $LOG_FILE
        send_telegram_notification "Высокое использование памяти: ${usage}%"
    fi
}

# Основная логика
main() {
    check_app_status
    check_website
    check_disk_usage
    check_memory_usage
    
    # Ротация логов (оставляем только последние 1000 строк)
    if [[ -f $LOG_FILE ]]; then
        tail -n 1000 $LOG_FILE > ${LOG_FILE}.tmp
        mv ${LOG_FILE}.tmp $LOG_FILE
    fi
}

main
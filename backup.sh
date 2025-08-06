#!/bin/bash

# Скрипт бэкапа для naidizakupku.ru
# Сохранить как /usr/local/bin/naidizakupku-backup.sh

BACKUP_DIR="/var/backups/naidizakupku"
APP_DIR="/var/www/naidizakupku"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Создаем директорию для бэкапов
mkdir -p $BACKUP_DIR

# Функция логирования
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S'): $1" >> $BACKUP_DIR/backup.log
}

# Создаем бэкап приложения
create_backup() {
    log "Starting backup"
    
    # Создаем архив приложения
    tar -czf $BACKUP_DIR/naidizakupku_${DATE}.tar.gz \
        -C /var/www naidizakupku \
        --exclude="node_modules" \
        --exclude=".next" \
        --exclude="*.log"
    
    if [[ $? -eq 0 ]]; then
        log "Backup created successfully: naidizakupku_${DATE}.tar.gz"
    else
        log "ERROR: Backup creation failed"
        exit 1
    fi
}

# Удаляем старые бэкапы
cleanup_old_backups() {
    log "Cleaning up old backups (older than $RETENTION_DAYS days)"
    
    find $BACKUP_DIR -name "naidizakupku_*.tar.gz" -mtime +$RETENTION_DAYS -delete
    
    # Ротация логов
    if [[ -f $BACKUP_DIR/backup.log ]]; then
        tail -n 1000 $BACKUP_DIR/backup.log > $BACKUP_DIR/backup.log.tmp
        mv $BACKUP_DIR/backup.log.tmp $BACKUP_DIR/backup.log
    fi
}

# Основная логика
main() {
    create_backup
    cleanup_old_backups
    log "Backup process completed"
}

main
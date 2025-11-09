// download-handler.js
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для кнопок скачивания
    const downloadButtons = document.querySelectorAll('.btn-download');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const fileName = this.getAttribute('data-file');
            const fileUrl = this.getAttribute('href');
            
            // Проверяем, является ли ссылка внешней (GitHub)
            if (fileUrl && fileUrl.startsWith('http')) {
                // Для внешних ссылок не предотвращаем поведение по умолчанию
                // Но показываем уведомление и отслеживаем скачивание
                
                // Показываем уведомление о скачивании
                showDownloadNotification(fileName);
                
                // Отправляем событие в аналитику
                trackDownloadEvent(fileName);
                
                // Открываем в новой вкладке (если еще не указано)
                if (!this.getAttribute('target')) {
                    this.setAttribute('target', '_blank');
                    this.setAttribute('rel', 'noopener noreferrer');
                }
                
                // НЕ вызываем e.preventDefault() - позволяем ссылке работать
            } else {
                // Для локальных файлов используем старую логику
                e.preventDefault();
                
                const localFileUrl = `downloads/${fileName}`;
                
                // Создаем временную ссылку для скачивания
                const link = document.createElement('a');
                link.href = localFileUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Показываем уведомление о скачивании
                showDownloadNotification(fileName);
                
                // Отправляем событие в аналитику
                trackDownloadEvent(fileName);
            }
        });
    });
    
    // Функция для показа уведомления о скачивании
    function showDownloadNotification(fileName) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'download-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Downloading ${fileName}...</span>
            </div>
        `;
        
        // Добавляем стили
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-light);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Функция для отслеживания скачиваний
    function trackDownloadEvent(fileName) {
        console.log(`Download started: ${fileName}`);
        // Здесь можно добавить код для Google Analytics или другой аналитики
        // Например: gtag('event', 'download', { 'file_name': fileName });
        
        // Обновляем статистику в localStorage
        updateDownloadStats(fileName);
    }
    
    // Функция для обновления статистики скачиваний
    function updateDownloadStats(fileName) {
        let stats = JSON.parse(localStorage.getItem('downloadStats')) || {};
        
        if (!stats[fileName]) {
            stats[fileName] = 0;
        }
        
        stats[fileName]++;
        localStorage.setItem('downloadStats', JSON.stringify(stats));
        
        // Показываем обновленную статистику
        showDownloadStats();
    }
    
    // Функция для отображения статистики скачиваний
    function showDownloadStats() {
        const stats = JSON.parse(localStorage.getItem('downloadStats')) || {};
        const statsElements = document.querySelectorAll('.download-stats');
        
        statsElements.forEach(element => {
            const fileName = element.getAttribute('data-file');
            const count = stats[fileName] || 0;
            
            if (count > 0) {
                element.textContent = `${count} downloads`;
                element.style.display = 'block';
            }
        });
    }
    
    // Показываем статистику при загрузке страницы
    showDownloadStats();
});
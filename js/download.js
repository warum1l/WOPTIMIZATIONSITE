// download.js
document.addEventListener('DOMContentLoaded', function() {
    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = question.nextElementSibling;
            
            // Toggle active class on FAQ item
            faqItem.classList.toggle('active');
            
            // Toggle answer visibility
            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = 0;
            }
            
            // Close other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    const otherFaqItem = otherQuestion.parentElement;
                    const otherAnswer = otherQuestion.nextElementSibling;
                    
                    otherFaqItem.classList.remove('active');
                    otherAnswer.style.maxHeight = 0;
                }
            });
        });
    });
    
    // Обработчик для статистики скачиваний (только для внешних ссылок)
    const downloadButtons = document.querySelectorAll('.btn-download');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const fileName = this.getAttribute('data-file');
            const href = this.getAttribute('href'); 
            
            // Обновляем статистику только для внешних ссылок
            if (href && href.startsWith('http')) {
                updateDownloadStats(fileName);
                
                // Добавляем небольшую задержку для отслеживания
                setTimeout(() => {
                    // Открываем ссылку в новой вкладке
                    window.open(href, '_blank');
                }, 100);
                
                // Предотвращаем стандартное поведение
                e.preventDefault();
            }
            // Для локальных ссылок оставляем стандартное поведение
        });
    });
    
    // Показываем статистику скачиваний
    showDownloadStats();
});

// Функция для обновления статистики скачиваний
function updateDownloadStats(fileName) {
    let stats = JSON.parse(localStorage.getItem('downloadStats')) || {};
    
    if (!stats[fileName]) {
        stats[fileName] = 0;
    }
    
    stats[fileName]++;
    localStorage.setItem('downloadStats', JSON.stringify(stats));
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
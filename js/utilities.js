// Utilities Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips for download buttons
    const downloadButtons = document.querySelectorAll('[data-tooltip]');
    
    downloadButtons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            showTooltip(e, tooltipText);
        });
        
        button.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
    
    // Function to show tooltip
    function showTooltip(e, text) {
        // Remove existing tooltip if any
        hideTooltip();
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        // Position tooltip
        const x = e.clientX;
        const y = e.clientY;
        
        tooltip.style.left = `${x + 10}px`;
        tooltip.style.top = `${y + 10}px`;
        
        // Add to document
        document.body.appendChild(tooltip);
    }
    
    // Function to hide tooltip
    function hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    // Add animation to elements when they come into view
    const animatedElements = document.querySelectorAll('.reveal');
    
    function checkAnimation() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    // Check animation on scroll and resize
    window.addEventListener('scroll', checkAnimation);
    window.addEventListener('resize', checkAnimation);
    
    // Initial check
    checkAnimation();
    
    // Handle script download notifications
    const scriptDownloadButtons = document.querySelectorAll('.btn-script-download');
    
    scriptDownloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const scriptName = this.parentElement.querySelector('h3').textContent;
            showDownloadNotification(`Downloading ${scriptName}...`);
        });
    });
    
    // Function to show download notification
    function showDownloadNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'download-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});
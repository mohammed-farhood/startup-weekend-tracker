document.addEventListener('DOMContentLoaded', () => {
    // Handle checkbox toggling to strike through text
    const checkboxes = document.querySelectorAll('.todo-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const listItem = this.closest('.todo-item');
            if (this.checked) {
                listItem.classList.add('completed');
            } else {
                listItem.classList.remove('completed');
            }
        });
    });
});
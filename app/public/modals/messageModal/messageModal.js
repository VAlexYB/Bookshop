document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        fetch('/modals/messageModal/confirmModal.html').then(response => response.text()), 
        fetch('/modals/messageModal/alertModal.html').then(response => response.text())
    ]).then(([confirmHtml, alertHtml]) => {
        document.body.insertAdjacentHTML('afterbegin', confirmHtml);
        document.body.insertAdjacentHTML('afterbegin', alertHtml);

        const confirmModal = document.getElementById('confirmModal');
        document.getElementById('cancelBtn').addEventListener('click', function() {
            confirmModal.close();
        });

        document.dispatchEvent(new Event('modalsLoaded'));
    });
});

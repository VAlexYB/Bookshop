import { initAccountModal } from '/modals/accountModals/accountModal.js';

document.addEventListener('DOMContentLoaded', () => {
    const topBar = document.getElementById('top-menu');
    if(topBar) {
        fetch('/main/topMenu.html').then(response => response.text())
        .then(html => {
            topBar.innerHTML = html;
            initAccountModal();

            const searchBtn = document.getElementById('bookSearchBtn');
            if (searchBtn) {
                searchBtn.addEventListener('click', function(event) {
                    event.preventDefault(); 
                    loadedAfterClick = 0;
                    currentPage = 1;
                    loadBooks(currentPage, pageSize, document.getElementById('searchInput').value, selectedGenre);
                });
            }
        })
    }
});

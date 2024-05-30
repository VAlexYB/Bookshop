document.addEventListener('DOMContentLoaded', () => {
    fetch('/manager/sideMenu/sideMenu.html').then(response => response.text())
    .then(html => {
        document.body.insertAdjacentHTML('afterbegin', html);
        const logoutLink = document.getElementById('logoutLink');

        logoutLink.addEventListener('click', function(event) {
            event.preventDefault(); 
            localStorage.removeItem('token');
            window.location.href = '/main/test.html';
        });
    });    
});
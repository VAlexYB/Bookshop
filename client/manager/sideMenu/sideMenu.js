document.addEventListener('DOMContentLoaded', () => {
    fetch('/manager/sideMenu/sideMenu.html').then(response => response.text())
    .then(html => {
        document.body.insertAdjacentHTML('afterbegin', html);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    fetch('/admin/sideMenu/sideMenu.html').then(response => response.text())
    .then(html => {
        document.body.insertAdjacentHTML('afterbegin', html);
    });
});
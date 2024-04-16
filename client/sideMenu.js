document.addEventListener('DOMContentLoaded', () => {
    const sideBar = document.getElementById('side-menu');
    if(sideBar) {
        sideBar.innerHTML = 
        `
            <nav> Жанры
                <a href="test.html">Фантастика</a> 
                <a href="test.html">Детектив</a> 
                <a href="test.html">Приключенческие</a> 
                <a href="test.html">Психология</a>
            </nav>
        `
    }
});
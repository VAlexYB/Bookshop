document.addEventListener('DOMContentLoaded', () => {
    const sideBar = document.getElementById('side-menu');
    if(sideBar) {
        sideBar.innerHTML = 
        `
        <nav class="side-menu">
            <div class="genres">
                <div class="title">Жанры</div>
                <div class="list">
                    <a href="test.html">Фантастика</a> 
                    <a href="test.html">Детектив</a> 
                    <a href="test.html">Приключенческие</a> 
                    <a href="test.html">Психология</a>
                </div>
            </div>
            <div class="sidebar-section">
                <div>Открытый каталог</div>
                <label class="toggler-wrapper style-1">
                    <input type="checkbox" >
                    <div class="toggler-slider">
                        <div class="toggler-knob"></div>
                    </div>
                </label>
            </div>
            <div class="sidebar-section">
                <div>Ограниченный каталог</div>
                <label class="toggler-wrapper style-1">
                    <input type="checkbox" >
                    <div class="toggler-slider">
                        <div class="toggler-knob"></div>
                    </div>
                </label>
            </div>
        </nav>
        
        `
    }
});
import { initAccountModal } from '/modals/accountModals/accountModal.js';

document.addEventListener('DOMContentLoaded', () => {
    const topBar = document.getElementById('top-menu');
    if(topBar) {
        topBar.innerHTML = 
        `
            <nav>
                <a href="/test.html">
                    <span style class="logo">
                        <img src="/assets/icons/logo.png" style="margin-bottom: 5px">
                        <span>Ex libris</span>
                    </span>
                </a> 
                <form action="" method="get" class="book-search">
                    <input name="s" placeholder="Искать на Ex libris" type="search">
                    <button type="submit">Поиск</button>
                </form>
                <a href="/user/orders/orders.html" class="nav-el">
                    <img src="/assets/icons/bag.png" alt="" class="icon">
                    <span>Заказы</span>
                </a> 
                <a href="/user/books/books.html" class="nav-el">
                    <img src="/assets/icons/book.png" alt="" class="icon">
                    <span>Книги</span>
                </a> 
                <a href="#" id="accountBtn" class="nav-el">
                    <img src="/assets/icons/account.png" alt="" class="icon">
                    <span>Войти</span>
                </a> 
            </nav>
        `;

        initAccountModal();
    }
});

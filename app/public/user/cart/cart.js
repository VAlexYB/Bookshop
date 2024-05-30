function showNoAccessModal() {
    const alertModal = document.getElementById('alertModal');
    if (alertModal) {
        document.getElementById('alertTitle').innerText = 'Ошибка';
        document.getElementById('alertText').innerText = 'Для перехода на эту страницу надо быть авторизованным как юзер';  
        alertModal.showModal();
        document.getElementById('alertBtn').addEventListener('click', function() {
            alertModal.close();
            window.location.href = '/main/test.html';
        });
    } else {
        console.error('Модальное окно alertModal не загружено');
    }
}


document.addEventListener('modalsLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        document.body.classList.add('blurred');
        showNoAccessModal();
    }
    
    try {
        const decodedToken = jwt_decode(token);
        if (!decodedToken.roles || !decodedToken.roles.includes('USER')) {
            document.body.classList.add('blurred');
            showNoAccessModal();
        }
    } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
        document.body.classList.add('blurred');
        showNoAccessModal();
    }
});


document.addEventListener('DOMContentLoaded', async () => {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const orderButton = document.getElementById('orderButton');

    async function fetchCartSummary() {
        try {
            fetch(`http://localhost:3000/api/getSummary`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })
            .then(response => response.json())
            .then(cartSummary => {
                updateCartDisplay(cartSummary);
            });            
        } catch (error) {
            console.error('Ошибка при получении сводки корзины:', error);
        }
    }

    function updateCartDisplay(cartSummary) {
        console.log(cartSummary);
        cartItemsContainer.innerHTML = '';
    
        const cartItemTemplate = document.getElementById('cartItemTemplate');
    
        for (const [bookId, bookDetails] of Object.entries(cartSummary.bookSummary)) {
            const cartItem = cartItemTemplate.content.cloneNode(true);
    
            const bookCover = cartItem.querySelector('.book-cover img');
            bookCover.src = bookDetails.extension ? `http://localhost:3000/images/covers/${bookId}.${bookDetails.extension}` : 'http://localhost:3000/images/covers/default.jpg';
    
            const bookTitle = cartItem.querySelector('.book-title');
            bookTitle.textContent = bookDetails.title;
    
            const bookAuthor = cartItem.querySelector('.book-author');
            bookAuthor.textContent = bookDetails.author;
    
            const bookCount = cartItem.querySelector('.book-count');
            bookCount.textContent = `Количество: ${bookDetails.count}`;
    
            const bookPrice = cartItem.querySelector('.book-price');
            bookPrice.textContent = `${bookDetails.totalPrice} рублей`;
    
            const removeButton = cartItem.querySelector('.remove-button');
            removeButton.addEventListener('click', () => modifyCartItem(bookId, 'remove'));
    
            const addButton = cartItem.querySelector('.add-button');
            addButton.addEventListener('click', () => modifyCartItem(bookId, 'add'));
    
            cartItemsContainer.appendChild(cartItem);
        }
    
        totalPriceElement.textContent = `Общая стоимость: ${cartSummary.totalAmount} руб.`;
    }
    

    async function modifyCartItem(bookId, action) {
        const url = action === 'add'
            ? `http://localhost:3000/api/addToCart?id=${bookId}`
            : `http://localhost:3000/api/removeFromCart?id=${bookId}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.message) {
                const alertModal = document.getElementById('alertModal');
                document.getElementById('alertTitle').innerText = 'Корзина';
                document.getElementById('alertText').innerText = data.message;  
                alertModal.showModal();
                document.getElementById('alertBtn').addEventListener('click', function() {
                    alertModal.close();
                    fetchCartSummary();
                });
            }
        })
    }

    orderButton.addEventListener('click', async () => {
        const orderModal = document.getElementById('makeOrderModal');
        if(orderModal) {
            fetch('http://localhost:3000/api/buyerInfo', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => response.json())
            .then(data => { 
                console.log(data);
                document.getElementById('accountNumber').textContent = `${data.user.cardIdFirstDigits}########${data.user.cardIdLastDigits}`;
                document.getElementById('orderCost').textContent = data.cartPrice;
                document.getElementById('recipientName').value = `${data.user.surname} ${data.user.name} ${data.user.patronimyc}`;
                document.getElementById('recipientPhone').value = data.user.phoneNumber;
                orderModal.showModal();

            });
        }
    });

    fetchCartSummary();
});
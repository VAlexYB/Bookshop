document.addEventListener('DOMContentLoaded', function() {
    async function fetchBookData() {
        const queryParams = new URLSearchParams(window.location.search);
        const bookId = queryParams.get('bookId');
        
        if (!bookId) {
            console.error('ID книги не указан.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/bookById?id=${bookId}`);
            const bookData = await response.json();

            document.getElementById('bookCoverImage').src = bookData.Extension ? `http://localhost:3000/images/covers/${bookData._id}.${bookData.Extension}` : 'http://localhost:3000/images/covers/default.jpg';
            document.getElementById('bookTitle').textContent = bookData.Title;
            document.getElementById('bookAuthor').textContent = bookData.Author;
            document.getElementById('bookDescription').textContent = bookData.Description;
            document.getElementById('bookGenres').textContent = bookData.Genres.join(', ');

            if (!bookData.IsOpen) {
                document.getElementById('buyButton').style.display = 'block';
            }

            const addToCartBtn = document.getElementById('addToCartBtn');
            addToCartBtn.addEventListener('click', () => handleAddBookToCart(bookData._id))

        } catch (error) {
            console.error('Ошибка при загрузке информации о книге:', error);
        }
    }

    fetchBookData();
});


window.handleAddBookToCart = (bookId) => {
    fetch(`http://localhost:3000/api/createOrder?id=${bookId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.message) {
            const alertModal = document.getElementById('alertModal');
            document.getElementById('alertTitle').innerText = 'Создание заказа';
            document.getElementById('alertText').innerText = data.message;  
            alertModal.showModal();
            document.getElementById('alertBtn').addEventListener('click', function() {
                alertModal.close();
            });
        }
        else {
            console.log(data);
            const makeOrderModal = document.getElementById('makeOrderModal');
            document.getElementById('bookId').value = bookId;
            document.getElementById('accountNumber').innerText = data.account;
            document.getElementById('orderCost').innerText = data.price;
            document.getElementById('recipientName').value = data.recipient;
            document.getElementById('recipientPhone').value = data.phone;  
            makeOrderModal.showModal();
        }
    })
}

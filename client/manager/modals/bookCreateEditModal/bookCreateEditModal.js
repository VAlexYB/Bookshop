document.addEventListener('DOMContentLoaded', () => {
    fetch('/manager/modals/bookCreateEditModal/bookCreateEditModal.html').then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('afterbegin', html);
            const addBookForm = document.getElementById('addBookForm');
            addBookForm.addEventListener('submit', handleBookCreateEditFormSubmit);
        })
});

handleBookCreateEditFormSubmit = (event) => {
    event.preventDefault();
    document.getElementById('bookModal').close();
    const formData = new FormData(addBookForm);

    const requestData = {
        bookId: formData.get('bookId'),
        title: formData.get('title'),
        author: formData.get('author'),
        genres: formData.get('genre'),
        year: formData.get('year'),
        price: formData.get('price')
    };

    fetch('http://localhost:3000/api/addBook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        const alertModal = document.getElementById('alertModal');
        document.getElementById('alertTitle').innerText = formData.get('bookId') ? 'Редактирование книги' : 'Добавление книги';
        document.getElementById('alertText').innerText = data.message;  
        alertModal.showModal();
        document.getElementById('alertBtn').addEventListener('click', function() {
            alertModal.close();
        })
    })
    .catch((error) => {
        console.error('Ошибка:', error);
    });
}


document.getElementById('loadBooks').addEventListener('click', () => {
    fetch('http://localhost:3000/api/books')
        .then(response => response.json())
        .then(books => {
            const booksList = document.getElementById('booksList');
            booksList.innerHTML = ''; // Очистить список перед добавлением новых элементов
            books.forEach(book => {
                const listItem = document.createElement('li');
                listItem.textContent = `${book.Title} - ${book.Author}`;
                booksList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Ошибка при загрузке списка книг:', error));
});

document.getElementById('loadBookInfo').addEventListener('click', () => {
    const bookId = document.getElementById('bookId').value;
    fetch(`http://localhost:3000/books/${bookId}`)
        .then(response => response.text())
        .then(bookInfo => {
            const bookInfoDiv = document.getElementById('bookInfo');
            bookInfoDiv.textContent = bookInfo;
        })
        .catch(error => console.error('Ошибка при загрузке информации о книге:', error));
});

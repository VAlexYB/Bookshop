document.addEventListener('DOMContentLoaded', function(){
    loadBooks();
});

let currentPage = 1;
const pageSize = 20;
let loadedAfterClick = 0;

window.addEventListener('scroll', () => {
    if(window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100 && loadedAfterClick < 100) {
        loadBooks(currentPage, pageSize);
    }
});


function loadBooks(page = 1, pageSize = 20) {
        fetch(`http://localhost:3000/api/books?page=${page}&pageSize=${pageSize}`)
        .then(response => response.json())
        .then(books => {
            const booksList = document.getElementById('booksList');
            const template = document.getElementById('bookCardTemplate')
            books.forEach(book => {
                const bookCard = template.content.cloneNode(true);
                const card = bookCard.querySelector('.book-card');
                card.setAttribute('bookId', book.Id);

                const img = bookCard.querySelector('.book-cover img');
                img.src = book.Extension ? `http://localhost:3000/images/covers/${book.Id}.${book.Extension}` : 'http://localhost:3000/images/covers/default.jpg';
                img.alt = book.Title;
                
                bookCard.querySelector('.book-title').textContent = book.Title;
                bookCard.querySelector('.book-author').textContent = book.Author;
                
                card.addEventListener('click', function() {
                    window.location.href = `/user/bookInfo/bookInfo.html?bookId=${book.Id}`;
                });

                booksList.appendChild(bookCard);
            });
            loadedAfterClick += books.length;
            currentPage++;
            checkLoadMoreButton();
        })
        .catch(error => console.error('Ошибка при загрузке списка книг:', error));
    
};

function checkLoadMoreButton() {
    const loadMoreButton = document.getElementById('loadMoreBooks');
    if(loadedAfterClick >= 100) {
        loadMoreButton.style.display = 'block';
    } else {
        loadMoreButton.style.display = 'none';
    }
}

document.getElementById('loadMoreBooks').addEventListener('click', () => {
    loadBooks(currentPage, pageSize);
    loadedAfterClick = 0;
})

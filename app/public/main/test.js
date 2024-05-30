let isOpenCatalogChecked = false;
let isRestrictedCatalogChecked = false;

document.addEventListener('DOMContentLoaded', function(){
    loadBooks();
});

let currentPage = 1;
const pageSize = 20;
let loadedAfterClick = 0;

window.addEventListener('scroll', () => {
    if(window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100 && loadedAfterClick < 100) {
        loadBooks(currentPage, pageSize, document.getElementById('searchInput').value), link.getAttribute('data-genre');
    }
});


function loadBooks(page = 1, pageSize = 20, searchQuery = '', genre = '') {
    const filter = {
        page: page,
        pageSize: pageSize,
        term: searchQuery,
        genre: genre
    }

    if (typeof isOpenCatalogChecked !== 'undefined'
     && typeof isRestrictedCatalogChecked !== 'undefined'
      && isOpenCatalogChecked !== isRestrictedCatalogChecked) {
        filter.isOpen = isOpenCatalogChecked;
    }

    fetch(`http://localhost:3000/api/filteredBooks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filter)
    })
    .then(response => response.json())
    .then(books => {
        if (books.message) {
            const alertModal = document.getElementById('alertModal');
            document.getElementById('alertTitle').innerText = 'Ошибка';
            document.getElementById('alertText').innerText = books.message;  
            alertModal.showModal();
            document.getElementById('alertBtn').addEventListener('click', function() {
                alertModal.close();
            });
            return;
        }   
        const booksList = document.getElementById('booksList');
        if(page === 1) { booksList.innerHTML = ''};
        const template = document.getElementById('bookCardTemplate')
        books.forEach(book => {
            const bookCard = template.content.cloneNode(true);
            const card = bookCard.querySelector('.book-card');
            card.setAttribute('bookId', book._id);

            const img = bookCard.querySelector('.book-cover img');
            img.src = book.Extension ? `http://localhost:3000/images/covers/${book._id}.${book.Extension}` : 'http://localhost:3000/images/covers/default.jpg';
            img.alt = book.Title;
            
            bookCard.querySelector('.book-title').textContent = book.Title;
            bookCard.querySelector('.book-author').textContent = book.Author.fullname;
            
            card.addEventListener('click', function() {
                window.location.href = `/user/bookInfo/bookInfo.html?bookId=${book._id}`;
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

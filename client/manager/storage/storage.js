document.addEventListener('DOMContentLoaded', function(){
    loadStorage();
});

let currentPage = 1;
const pageSize = 20;
let loadedAfterClick = 0;


window.addEventListener('scroll', () => {
    if(window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100 && loadedAfterClick < 100) {
        loadStorage(currentPage, pageSize);
    }
});


function loadStorage(page = 1, pageSize = 20) {
    fetch(`http://localhost:3000/api/filteredStorages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(storages => {
        console.log(storages);
        const storageBooksTable = document.getElementById('storageBooksTable');
        storages.forEach((storage, index) => {
            const row = storageBooksTable.insertRow(-1);
            row.insertCell(0).textContent = ++index;  
            const coverCell = row.insertCell(1);
            const img = document.createElement('img');
            img.style.width = '30px';
            img.src = storage.extension ? `http://localhost:3000/images/covers/${storage.bookId}.${storage.extension}` : 'http://localhost:3000/images/covers/default.jpg';
            coverCell.appendChild(img);
            row.insertCell(2).textContent = storage.title; 
            row.insertCell(3).textContent = storage.author; 
            row.insertCell(4).textContent = storage.year; 
            row.insertCell(5).textContent = storage.amount;
            row.insertCell(6).textContent = storage.price; 
            
            const actionsCell = row.insertCell(7);
            const editButton = document.createElement('button');
            const editImg = document.createElement('img');
            editImg.src = '/assets/icons/pencil.png';
            editImg.style.width = '16px';
            editButton.appendChild(editImg);
            editButton.onclick = function() { editPrice(storage); }; 
            actionsCell.appendChild(editButton);
            index++;
        });
    })
    .catch(error => console.error('Ошибка при загрузке списка книг на складе:', error));
    
};

function checkLoadMoreButton() {
    const loadMoreButton = document.getElementById('loadMoreBooks');
    if(loadedAfterClick >= 100) {
        loadMoreButton.style.display = 'block';
    } else {
        loadMoreButton.style.display = 'none';
    }
};

document.getElementById('loadMoreBooks').addEventListener('click', () => {
    loadStorage(currentPage, pageSize);
    loadedAfterClick = 0;
});

window.openAddSupplyModal = function () {
    const supplyModal = document.getElementById('supplyModal');
    if(supplyModal) {
        supplyModal.showModal();
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', () => {
            const term = searchInput.value.toLowerCase();
            if (term.length > 3) {
                let filter = {};
                filter.term = term;

                const booksList = document.getElementById('booksList');
                Array.from(booksList.children).forEach(child => {
                    if (child !== booksList.querySelector('template')) {
                        booksList.removeChild(child);
                    }
                });

                fetch('http://localhost:3000/api/filteredBooks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(filter)
                })
                .then(response => response.json())
                .then(books =>  {
                    const template = document.getElementById('bookCardTemplate')
                    books.forEach (book => {
                        const bookCard = template.content.cloneNode(true);
                        const card = bookCard.querySelector('.book-card');
                        card.setAttribute('bookId', book._id);
                        card.setAttribute('title', book.Title);

                        const img = bookCard.querySelector('.book-cover img');
                        img.src = book.Extension ? `http://localhost:3000/images/covers/${book._id}.${book.Extension}` : 'http://localhost:3000/images/covers/default.jpg';
                        img.alt = book.Title;
                        bookCard.querySelector('.book-title').textContent = book.Title;
                        bookCard.querySelector('.book-author').textContent = book.Author;
                        booksList.appendChild(bookCard);
                    });
                });


                booksList.addEventListener('click', function(event) {
                    const target = event.target;
                    if(target.classList.contains('book-card')) {
                        document.getElementById('supplyBookId').value = target.getAttribute('bookId');
                        const bookCards = document.querySelectorAll('.selected');
                        bookCards.forEach(card => {
                            card.classList.remove('selected'); 
                        });
                        target.classList.add('selected');
                    }
                })
            };
        });
    }     
    else {
        
    }
}

window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        document.querySelectorAll('.modal').forEach(modal => modal.close());
    }
};

window.editPrice = function (storage) {
    const priceEditModal = document.getElementById('priceEditModal');
    if(priceEditModal) {
        document.getElementById('storageId').value = storage._id;
        document.getElementById('modalName').textContent = "Редактирование цены";
        document.getElementById('title').textContent = storage.title; 
        document.getElementById('author').textContent = storage.author; 
        document.getElementById('year').textContent = storage.year; 
        priceEditModal.showModal();
    }
}
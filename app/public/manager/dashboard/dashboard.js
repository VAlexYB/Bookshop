function showNoAccessModal() {
    const alertModal = document.getElementById('alertModal');
    if (alertModal) {
        document.getElementById('alertTitle').innerText = 'Ошибка';
        document.getElementById('alertText').innerText = 'Для перехода на эту страницу надо быть авторизованным как менеджер';  
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
        if (!decodedToken.roles || !decodedToken.roles.includes('CONTENT-MANAGER')) {
            document.body.classList.add('blurred');
            showNoAccessModal();
        }
    } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
        document.body.classList.add('blurred');
        showNoAccessModal();
    }
});



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

const searchBtn = document.getElementById('bookSearchBtn');
if (searchBtn) {
    searchBtn.addEventListener('click', function(event) {
        event.preventDefault(); 
        const table = document.getElementById('booksTable');
        const rowCount = table.rows.length;
        for (let i = rowCount - 1; i > 0; i--) {
            table.deleteRow(i);
        }
        loadedAfterClick = 0;
        currentPage = 1;
        loadBooks(currentPage, pageSize, document.getElementById('searchInput').value);
    });
}

function loadBooks(page = 1, pageSize = 20, term = '') {
    const filter = {
        page: page,
        pageSize: pageSize,
        term: term
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
        const booksTable = document.getElementById('booksTable');
        books.forEach((book, index) => {
            const row = booksTable.insertRow(-1);
            row.insertCell(0).textContent = ++index; 
            const coverCell = row.insertCell(1);
            const img = document.createElement('img');
            img.style.width = '30px';
            img.src = book.Extension ? `http://localhost:3000/images/covers/${book._id}.${book.Extension}` : 'http://localhost:3000/images/covers/default.jpg';
            coverCell.appendChild(img);
            row.insertCell(2).textContent = book.Title; 
            row.insertCell(3).textContent = book.Author.fullname; 
            row.insertCell(4).textContent = book.Year; 
            row.insertCell(5).textContent = book.Genres.join(', '); 
            row.insertCell(6).textContent = book.Price; 
            const actionsCell = row.insertCell(7);

            const editButton = document.createElement('button');
            const editImg = document.createElement('img');
            editImg.src = '/assets/icons/pencil.png';
            editImg.style.width = '16px';
            editButton.appendChild(editImg);
            editButton.onclick = function() { openBookEditModal(book); }; 
            actionsCell.appendChild(editButton);

            const addFileButton = document.createElement('button');
            const addFileImg = document.createElement('img');
            addFileImg.src = '/assets/icons/file.png';
            addFileImg.style.width = '16px';
            addFileButton.appendChild(addFileImg);
            addFileButton.onclick = function() { uploadFile(book._id); };
            actionsCell.appendChild(addFileButton);
            
            const deleteButton = document.createElement('button');
            const deleteImg = document.createElement('img');
            deleteImg.src = '/assets/icons/delete.png';
            deleteImg.style.width = '16px';
            deleteButton.appendChild(deleteImg);
            deleteButton.onclick = function() { deleteBook(book); };
            actionsCell.appendChild(deleteButton);

            index++;
        });
        loadedAfterClick += books.length;
        currentPage++;
        checkLoadMoreButton();
    })
    .catch(error => console.error('Ошибка при загрузке списка менеджеров:', error));
    
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
    loadBooks(currentPage, pageSize);
    loadedAfterClick = 0;
});


window.openBookCreateModal = function () {
    const bookModal = document.getElementById('bookModal');
    if(bookModal) {
        const modalName = document.getElementById('modalName');
        modalName.innerText = 'Добавление книги';
        const inputs = bookModal.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
        bookModal.showModal();
    }     
}

window.openBookEditModal = function (book) {
    const bookModal = document.getElementById('bookModal');
    if(bookModal) {
        document.getElementById('editBookId').value = book._id;
        console.log(book._id);
        document.getElementById('modalName').innerText = 'Редактирование книги';
        document.getElementById('title').value = book.Title;
        document.getElementById('author').value = book.Author.fullname;
        currentAuthor = {
            name : book.Author.fullname,
            id: book.Author._id
        }
        document.getElementById('year').value = book.Year;
        document.getElementById('genre').value = book.Genres.join(', ');
        document.getElementById('price').value = book.Price;
        bookModal.showModal();
    }     
}

window.deleteBook = function (book) {
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
        document.getElementById('confirmTitle').innerText = 'Удаление книги';
        document.getElementById('confirmText').innerText = `Вы уверены что хотите удалить книгу "${book.Title}"?`;
        confirmModal.showModal();
    
        document.getElementById('confirmBtn').addEventListener('click', function() {
            fetch(`http://localhost:3000/api/deleteBook?id=${book._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                confirmModal.close();
                const alertModal = document.getElementById('alertModal');
                document.getElementById('alertTitle').innerText = 'Удаление книги';
                document.getElementById('alertText').innerText = data.message;  
                alertModal.showModal();
                document.getElementById('alertBtn').addEventListener('click', function() {
                    alertModal.close();
                    const table = document.getElementById('booksTable');
                    const rowCount = table.rows.length;
                    for (let i = rowCount - 1; i > 0; i--) {
                        table.deleteRow(i);
                    }
                    loadBooks();
                })
            })
            .catch((error) => {
                console.error('Ошибка:', error);
            });
        });
    }
}

window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        document.querySelectorAll('.modal').forEach(modal => modal.close());
    }
};

window.uploadFile = function (bookId) {
    const addFileModal = document.getElementById('addFileModal');
    document.getElementById('bookId').value = bookId;
    if(addFileModal) {
       addFileModal.showModal();
    }
}


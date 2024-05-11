import { handleRegisterFormSubmit } from "../../modals/accountModals/registerModal/registerModal.js";

document.addEventListener('DOMContentLoaded', function(){
    loadBooks();
    // initCreateEditModal();
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
    fetch(`http://localhost:3000/api/books?page=${page}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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
            img.src = book.Extension ? `http://localhost:3000/images/covers/${book.Id}.${book.Extension}` : 'http://localhost:3000/images/covers/default.jpg';
            coverCell.appendChild(img);
            row.insertCell(2).textContent = book.Title; 
            row.insertCell(3).textContent = book.Author; 
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
            addFileButton.onclick = function() { uploadFile(book); };
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

// function initCreateEditModal() {
//     fetch('../modals/mgrCreateEditModal/mgrCreateEditModal.html').then(response => response.text()).
//     then( html => {
//         document.body.insertAdjacentHTML('beforeend', html);
//         const registerForm = document.getElementById('mgrForm');
//         const btnCloseModals = document.querySelectorAll('.close');

//         registerForm.addEventListener('submit', handleRegisterFormSubmit);
//         btnCloseModals.forEach(btn => btn.addEventListener('click', () => {
//             registerModal.close();
//         }));
//     });
// }

window.openBookCreateModal = function () {
    const bookModal = document.getElementById('bookModal');
    if(bookModal) {
        const modalName = document.getElementById('modalName');
        modalName.innerText = 'Добавление книги';
        bookModal.showModal();
    }     
    else {
        console.log('Идиот, модалка книги не открывается');
    }
}

window.openBookEditModal = function (book) {
    const bookModal = document.getElementById('bookModal');
    if(bookModal) {
        document.getElementById('bookId').value = book._id;
        document.getElementById('modalName').innerText = 'Редактирование книги';
        document.getElementById('title').value = book.Title;
        document.getElementById('author').value = book.Author;
        document.getElementById('year').value = book.Year;
        //document.getElementById('genres').value = book.Genres.join(', ');
        document.getElementById('price').value = book.Price;
        bookModal.showModal();
    }     
    else {
        console.log('Идиот, модалка книги не открывается');
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

window.uploadFile = function (book) {
    const addFileModal = document.getElementById('addFileModal');
    if(addFileModal) {
       addFileModal.showModal();
    }
}
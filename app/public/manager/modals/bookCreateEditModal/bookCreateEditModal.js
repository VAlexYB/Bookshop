let currentAuthor = null;

document.addEventListener('DOMContentLoaded', () => {
    fetch('/manager/modals/bookCreateEditModal/bookCreateEditModal.html').then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('afterbegin', html);
            
            const genreSelect = document.getElementById('genre');
            fetch('http://localhost:3000/api/genres')
            .then(response => response.json())
            .then(genres => {
                genres.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre.value;
                    option.textContent = genre.value;
                    genreSelect.appendChild(option);
                });
            })


            const authorInput = document.getElementById('author');
            const authorList = document.getElementById('authorsList');

            authorInput.addEventListener('input', () => {
                const term = authorInput.value.trim();
                if (term.length <= 3) {
                    authorList.innerHTML = '';
                    return;
                }



                fetch(`http://localhost:3000/api/authors`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({term})
                })
                .then(response => response.json())
                .then(authors => {
                    authorList.innerHTML = '';
                    authors.forEach(author => {
                        const option = document.createElement('option');
                        option.value = author.fullname;
                        option.dataset.id = author._id;
                        authorList.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });
            });

            const addBookForm = document.getElementById('addBookForm');
            addBookForm.addEventListener('submit', handleBookCreateEditFormSubmit);
        })
});


handleBookCreateEditFormSubmit = (event) => {
    event.preventDefault();
    document.getElementById('bookModal').close();
    const formData = new FormData(addBookForm);

    const inputAuthor = formData.get('author');
    let changed;
    if(currentAuthor != null) {
        changed = inputAuthor != currentAuthor.name;
    } else {
        changed = true;
    }
    

    const authorList = document.getElementById('authorsList')
    const authorExists = Array.from(authorList.options).some(option => option.value === inputAuthor);

    if(changed && !authorExists) {
        const alertModal = document.getElementById('alertModal');
        document.getElementById('alertTitle').innerText = 'Ошибка';
        document.getElementById('alertText').innerText = 'Такого автора не существует в системе';  
        alertModal.showModal();
        document.getElementById('alertBtn').addEventListener('click', function() {
            alertModal.close();
        })
        return;
    }

    let author = null;

    if(!changed) {
        author = currentAuthor.id;
    } else {
        author = Array.from(authorList.options).find(option => option.value === inputAuthor).dataset.id;
    }

    const selectedGenres = Array.from(document.getElementById('genre').selectedOptions)
    .map(option => option.value)
    .join(', ');


    const requestData = {
        bookId: formData.get('editBookId'),
        title: formData.get('title'),
        author: author,
        genres: selectedGenres,
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
        document.getElementById('alertTitle').innerText = formData.get('editBookId') ? 'Редактирование книги' : 'Добавление книги';
        document.getElementById('alertText').innerText = data.message;  
        alertModal.showModal();
        document.getElementById('alertBtn').addEventListener('click', function() {
            alertModal.close();
            // const table = document.getElementById('booksTable');
            // const rowCount = table.rows.length;
            // for (let i = rowCount - 1; i > 0; i--) {
            //     table.deleteRow(i);
            // }
            // loadBooks()
            location.reload();
        })
    })
    .catch((error) => {
        console.error('Ошибка:', error);
    });
}
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



document.addEventListener('DOMContentLoaded', () => {
    const genreNameInput = document.getElementById('genreName');
    const addGenreBtn = document.getElementById('addGenreBtn');
    const genresList = document.getElementById('genresList');

    const fetchGenres = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/genres');
            const genres = await response.json();
            genresList.innerHTML = '';
            genres.forEach(genre => {
                const genreItem = document.createElement('div');
                genreItem.className = 'genre-item';

                const genreName = document.createElement('span');
                genreName.textContent = genre.value;

                
                const deleteButton = document.createElement('button');
                const deleteImg = document.createElement('img');
                deleteImg.src = '/assets/icons/delete.png';
                deleteImg.style.width = '16px';
                deleteButton.appendChild(deleteImg);
                deleteButton.className = 'delete-btn';
                deleteButton.setAttribute('data-id', genre._id);

                genreItem.appendChild(genreName);
                genreItem.appendChild(deleteButton);
                genresList.appendChild(genreItem);
            });
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    addGenreBtn.addEventListener('click', async () => {
        const name = genreNameInput.value.trim();
        if (!name) {
            document.getElementById('alertTitle').innerText = 'Ошибка';
            document.getElementById('alertText').innerText = 'Введите название жанра';  
            alertModal.showModal();
            document.getElementById('alertBtn').addEventListener('click', function() {
                alertModal.close();
            })
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/addGenre', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            });
            const result = await response.json();
            document.getElementById('alertTitle').innerText = 'Добавление книги';
            document.getElementById('alertText').innerText = result.message;  
            alertModal.showModal();
            document.getElementById('alertBtn').addEventListener('click', function() {
                alertModal.close();
            })
            if (response.ok) {
                fetchGenres();
                genreNameInput.value = '';
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    });

    genresList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const id = event.target.getAttribute('data-id');
            document.getElementById('confirmTitle').innerText = 'Удаление жанра';
            document.getElementById('confirmText').innerText = `Вы уверены что хотите удалить этот жанр?`;
            confirmModal.showModal();
        
            document.getElementById('confirmBtn').addEventListener('click', function() {
                fetch(`http://localhost:3000/api/deleteGenre?id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => response.json())
                .then(data => {
                    confirmModal.close();
                    const alertModal = document.getElementById('alertModal');
                    document.getElementById('alertTitle').innerText = 'Удаление жанра';
                    document.getElementById('alertText').innerText = data.message;  
                    alertModal.showModal();
                    fetchGenres();
                    document.getElementById('alertBtn').addEventListener('click', function() {
                        alertModal.close();
                    })
                })
                .catch((error) => {
                    console.error('Ошибка:', error);
                });
            });
        }
    });

    fetchGenres();
});
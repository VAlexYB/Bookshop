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
    const lastNameInput = document.getElementById('lastName');
    const firstNameInput = document.getElementById('firstName');
    const middleNameInput = document.getElementById('middleName');

    const addAuthorBtn = document.getElementById('addAuthorBtn');
    const authorsList = document.getElementById('authorsList');



    const fetchAuthors = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/authors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const authors = await response.json();
            authorsList.innerHTML = '';
            authors.forEach(author => {
                const authorItem = document.createElement('div');
                authorItem.className = 'author-item';

                const authorName = document.createElement('span');
                authorName.textContent = author.fullname;

                const deleteButton = document.createElement('button');
                const deleteImg = document.createElement('img');
                deleteImg.src = '/assets/icons/delete.png';
                deleteImg.style.width = '16px';
                deleteButton.appendChild(deleteImg);
                deleteButton.className = 'delete-btn';
                deleteButton.setAttribute('data-id', author._id);

                authorItem.appendChild(authorName);
                authorItem.appendChild(deleteButton);
                authorsList.appendChild(authorItem);
            });
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    addAuthorBtn.addEventListener('click', async () => {
        const fullname = `${lastNameInput.value} ${firstNameInput.value} ${middleNameInput.value}`;
        const lastname = lastNameInput.value.trim();
        const firstname = firstNameInput.value.trim();
        if (lastname.length === 0 || firstname.length === 0) {
            document.getElementById('alertTitle').innerText = 'Ошибка';
            document.getElementById('alertText').innerText = 'Введите фамилию и имя автора';
            alertModal.showModal();
            document.getElementById('alertBtn').addEventListener('click', function() {
                alertModal.close();
            })
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/addAuthor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullname })
            });
            const result = await response.json();
            document.getElementById('alertTitle').innerText = 'Добавление автора';
            document.getElementById('alertText').innerText = result.message;
            alertModal.showModal();
            document.getElementById('alertBtn').addEventListener('click', function() {
                alertModal.close();
            })
            if (response.ok) {
                fetchAuthors();
                lastNameInput.value = '';
                firstNameInput.value = '';
                middleNameInput.value = '';
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    });

    authorsList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const id = event.target.getAttribute('data-id');
            document.getElementById('confirmTitle').innerText = 'Удаление автора';
            document.getElementById('confirmText').innerText = `Вы уверены что хотите удалить этого автора?`;
            confirmModal.showModal();

            document.getElementById('confirmBtn').addEventListener('click', function() {
                fetch(`http://localhost:3000/api/deleteAuthor?id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => response.json())
                .then(data => {
                    confirmModal.close();
                    const alertModal = document.getElementById('alertModal');
                    document.getElementById('alertTitle').innerText = 'Удаление автора';
                    document.getElementById('alertText').innerText = data.message;
                    alertModal.showModal();
                    fetchAuthors();
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

    fetchAuthors();
});

function showNoAccessModal() {
    const alertModal = document.getElementById('alertModal');
    if (alertModal) {
        document.getElementById('alertTitle').innerText = 'Ошибка';
        document.getElementById('alertText').innerText = 'Для перехода на эту страницу надо быть авторизованным как администратор';  
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
        if (!decodedToken.roles || !decodedToken.roles.includes('ADMIN')) {
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
    loadManagers();
});

let currentPage = 1;
const pageSize = 20;
let loadedAfterClick = 0;


window.addEventListener('scroll', () => {
    if(window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100 && loadedAfterClick < 100) {
        loadManagers(currentPage, pageSize);
    }
});


function loadManagers(page = 1, pageSize = 20) {
    fetch(`http://localhost:3000/api/managers`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(managers => {
        const managersTable = document.getElementById('managersTable');
        managers.forEach((manager, index) => {
            const row = managersTable.insertRow(-1);
            row.insertCell(0).textContent = ++index; 
            row.insertCell(1).textContent = `${manager.surname} ${manager.name} ${manager.patronimyc}`; 
            row.insertCell(2).textContent = manager.username; 

            const date = new Date(manager.dateOfBirth);
            const formattedDate = date.toISOString().split('T')[0];
            row.insertCell(3).textContent = formattedDate;
            
            row.insertCell(4).textContent = manager.email; 
            row.insertCell(5).textContent = manager.phoneNumber; 
            
            const actionsCell = row.insertCell(6);
            const editButton = document.createElement('button');
            const editImg = document.createElement('img');
            editImg.src = '/assets/icons/pencil.png';
            editImg.style.width = '16px';
            editButton.appendChild(editImg);
            editButton.onclick = function() { openMgrEditModal(manager); }; 
            actionsCell.appendChild(editButton);
            
            const deleteButton = document.createElement('button');
            const deleteImg = document.createElement('img');
            deleteImg.src = '/assets/icons/delete.png';
            deleteImg.style.width = '16px';
            deleteButton.appendChild(deleteImg);
            deleteButton.onclick = function() { deleteManager(manager); };
            actionsCell.appendChild(deleteButton);
            index++;
        });
    })
    .catch(error => console.error('Ошибка при загрузке списка менеджеров:', error));
    
};

function checkLoadMoreButton() {
    const loadMoreButton = document.getElementById('loadMoreManagers');
    if(loadedAfterClick >= 100) {
        loadMoreButton.style.display = 'block';
    } else {
        loadMoreButton.style.display = 'none';
    }
};

document.getElementById('loadMoreManagers').addEventListener('click', () => {
    loadManagers(currentPage, pageSize);
    loadedAfterClick = 0;
});



window.openMgrCreateEditModal = function () {
    const mgrModal = document.getElementById('mgrModal');
    if(mgrModal) {
        const inputs = mgrModal.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
        mgrModal.showModal();
    }     
}

window.openMgrEditModal = function (manager) {
    const mgrModal = document.getElementById('mgrModal');
    if(mgrModal) {
        document.getElementById('mgrId').value = manager.userId;
        document.getElementById('surname').value = manager.surname;
        document.getElementById('name').value = manager.name;
        document.getElementById('patronimyc').value = manager.patronimyc;
        document.getElementById('dateOfBirth').value = manager.dateOfBirth;
        document.getElementById('email').value = manager.email;
        document.getElementById('phoneNumber').value = manager.phoneNumber;
        document.getElementById('username').value = manager.username;
        mgrModal.showModal();
    } 

}

window.deleteManager = function (manager) {
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
        document.getElementById('confirmTitle').innerText = 'Удаление профиля';
        document.getElementById('confirmText').innerText = `Вы уверены что хотите удалить профиль "${manager.surname} ${manager.name} ${manager.patronimyc}"?`;
        confirmModal.showModal();
    
        document.getElementById('confirmBtn').addEventListener('click', function() {
            fetch(`http://localhost:3000/api/deleteManager?id=${manager.userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => response.json())
            .then(data => {
                confirmModal.close();
                const alertModal = document.getElementById('alertModal');
                document.getElementById('alertTitle').innerText = 'Удаление профиля менеджера';
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
import { handleRegisterFormSubmit } from "../../modals/accountModals/registerModal/registerModal.js";

document.addEventListener('DOMContentLoaded', function(){
    loadUsers();
    // initCreateEditModal();
});

let currentPage = 1;
const pageSize = 20;
let loadedAfterClick = 0;


window.addEventListener('scroll', () => {
    if(window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100 && loadedAfterClick < 100) {
        loadUsers(currentPage, pageSize);
    }
});


function loadUsers(page = 1, pageSize = 20) {
    // Не позорься
    const usersTable = document.getElementById('usersTable');
    const row = usersTable.insertRow(-1);
    row.insertCell(0).textContent = 1; 
    row.insertCell(1).textContent = 'Иванов Иван Иванович'; 
    row.insertCell(2).textContent = 'vas'; 
    row.insertCell(3).textContent = '2012-12-12'; 
    row.insertCell(4).textContent = 'manager.email'; 
    row.insertCell(5).textContent = '89231234223';
    const actionsCell = row.insertCell(6);
    
    const banButton = document.createElement('button');
    const banImg = document.createElement('img');
    banImg.src = '/assets/icons/ban.png';
    banImg.style.width = '16px';
    banButton.appendChild(banImg);
    //banButton.onclick = function() { deleteManager(manager._id); };
    actionsCell.appendChild(banButton); 

    // fetch(`http://localhost:3000/api/users`, {
    //     method: 'GET',
    //     headers: {
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`
    //     }
    // })
    // .then(response => response.json())
    // .then(managers => {
    //     const managersTable = document.getElementById('managersTable');
    //     managers.forEach((manager, index) => {
    //         const row = managersTable.insertRow(-1);
    //         row.insertCell(0).textContent = ++index; 
    //         row.insertCell(1).textContent = `${manager.surname} ${manager.name} ${manager.patronimyc}`; 
    //         row.insertCell(2).textContent = manager.nickname; 
    //         row.insertCell(3).textContent = manager.dateOfBirth; 
    //         row.insertCell(4).textContent = manager.email; 
    //         row.insertCell(5).textContent = manager.phoneNumber; 
            
    //         const actionsCell = row.insertCell(6);
    //         const editButton = document.createElement('button');
    //         const editImg = document.createElement('img');
    //         editImg.src = '/assets/icons/pencil.png';
    //         editImg.style.width = '16px';
    //         editButton.appendChild(editImg);
    //         editButton.onclick = function() { editManager(manager._id); }; 
    //         actionsCell.appendChild(editButton);
            
    //         const deleteButton = document.createElement('button');
    //         const deleteImg = document.createElement('img');
    //         deleteImg.src = '/assets/icons/delete.png';
    //         deleteImg.style.width = '16px';
    //         deleteButton.appendChild(deleteImg);
    //         deleteButton.onclick = function() { deleteManager(manager._id); };
    //         actionsCell.appendChild(deleteButton);
    //         index++;
    //     });
    // })
    // .catch(error => console.error('Ошибка при загрузке списка менеджеров:', error));
    
};

// function checkLoadMoreButton() {
//     const loadMoreButton = document.getElementById('loadMoreManagers');
//     if(loadedAfterClick >= 100) {
//         loadMoreButton.style.display = 'block';
//     } else {
//         loadMoreButton.style.display = 'none';
//     }
// };

// document.getElementById('loadMoreManagers').addEventListener('click', () => {
//     loadUsers(currentPage, pageSize);
//     loadedAfterClick = 0;
// });

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

// function openMgrCreateEditModal() {
//     document.getElementById('mgrModal')
//     registerModal.openModal();
// }
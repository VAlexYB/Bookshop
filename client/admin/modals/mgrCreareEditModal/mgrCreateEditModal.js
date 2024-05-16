document.addEventListener('DOMContentLoaded', () => {
    fetch('/admin/modals/mgrCreareEditModal/mgrCreateEditModal.html').then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('afterbegin', html);
            const mgrForm = document.getElementById('mgrForm');
            mgrForm.addEventListener('submit', handleMgrCreateEditFormSubmit);
        })
});

handleMgrCreateEditFormSubmit = (event) => {
    event.preventDefault();
    document.getElementById('mgrModal').close();
    const formData = new FormData(mgrForm);
    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm');

    if(password !== passwordConfirm) {
        const alertModal = document.getElementById('alertModal');
        document.getElementById('alertTitle').innerText = 'Ошибка';
        document.getElementById('alertText').innerText = 'Пароли не совпадают';  
        alertModal.showModal();
        document.getElementById('alertBtn').addEventListener('click', function() {
            alertModal.close();
        })
        return;
    }

    const requestData = {
        mgrId: formData.get('mgrId'),
        surname: formData.get('surname'),
        name: formData.get('name'),
        patronimyc: formData.get('patronimyc'),
        dateOfBirth: formData.get('dateOfBirth'),
        email: formData.get('email'),
        phoneNumber: formData.get('phoneNumber'),
        username: formData.get('username'),
        password: password
    };


    fetch('http://localhost:3000/api/addManager', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        const alertModal = document.getElementById('alertModal');
        document.getElementById('alertTitle').innerText = formData.get('mgrId') ? 'Редактирование профиля' : 'Добавление менеджера';
        document.getElementById('alertText').innerText = data.message;  
        alertModal.showModal();
        document.getElementById('alertBtn').addEventListener('click', function() {
            alertModal.close();
        })
    })
    .catch((error) => {
        console.error('Ошибка:', error);
    });
}


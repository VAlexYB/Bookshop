document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/userInfo', {
            method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.surname) document.getElementById('surname').value = data.surname;
        if (data.name) document.getElementById('name').value = data.name;
        if (data.patronimyc) document.getElementById('patronimyc').value = data.patronimyc;
        if (data.nickname) document.getElementById('nickname').value = data.nickname;
        if (data.email) document.getElementById('email').value = data.email;
        if (data.phoneNumber) document.getElementById('phoneNumber').value = data.phoneNumber;
        if(data.hasLinkedCard) {
            document.getElementById('cardId').value = `${data.cardIdFirstDigits}########${data.cardIdLastDigits}`
        }

        const editPersonalInfoBtn = document.getElementById('editPersonalInfoBtn');

        editPersonalInfoBtn.addEventListener('click', () => {
            const surname = document.getElementById('surname').value;
            const name = document.getElementById('name').value;
            const patronimyc = document.getElementById('patronimyc').value;
            const nickname = document.getElementById('nickname').value;
            const dateOfBirth = document.getElementById('dateOfBirth').value;
            const email = document.getElementById('email').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const cardId = document.getElementById('cardId').value;
            const cardIdFirstDigits = cardId.slice(0, 4);
            const cardIdLastDigits = cardId.slice(-4);

            const userInfo = {
                surname,
                name,
                patronimyc,
                nickname,
                dateOfBirth,
                email,
                phoneNumber,
                cardIdFirstDigits,
                cardIdLastDigits
            };
    
            fetch('http://localhost:3000/api/editUserInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userInfo)
            })
            .then(response => response.json())
            .then(data => {
                if(data.message) {
                    const alertModal = document.getElementById('alertModal');
                    document.getElementById('alertTitle').innerText = 'Редактирование профиля';
                    document.getElementById('alertText').innerText = data.message;  
                    alertModal.showModal();
                    document.getElementById('alertBtn').addEventListener('click', function() {
                        alertModal.close();
                        window.location.reload();
                    });
                   
                }
            })
            .catch(error => console.error('Ошибка при отправке данных:', error));
        });
    
    })
    .catch(error => console.error('Ошибка при загрузке данных:', error));


    
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/main/test.html';
    });
});
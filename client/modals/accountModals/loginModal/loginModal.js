export const handleLoginFormSubmit = (event) => {
    event.preventDefault(); 

    document.getElementById('loginModal').style.display = 'none';
    
    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');
    const requestData = {
        username: username,
        password: password
    };

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        if(data.message) {
            const alertModal = document.getElementById('alertModal');
            document.getElementById('alertTitle').innerText = 'Вход в ЛК';
            document.getElementById('alertText').innerText = data.message;  
            alertModal.showModal();
            document.getElementById('alertBtn').addEventListener('click', function() {
                alertModal.close();
            })
        } else {
            localStorage.setItem('token', data.token);
            const decodedToken = jwt_decode(data.token);
            if(decodedToken.roles.includes('ADMIN')) {
                window.location.href = '/admin/dashboard/dashboard.html';
            }
            else if(decodedToken.roles.includes('CONTENT-MANAGER')) {
                window.location.href = '/manager/dashboard/dashboard.html';
            }   
            else if(decodedToken.roles.includes('USER')) {
                const alertModal = document.getElementById('alertModal');
                document.getElementById('alertTitle').innerText = 'Вход в ЛК';
                document.getElementById('alertText').innerText = "Вы успешно вошли в аккаунт";  
                alertModal.showModal();
                document.getElementById('alertBtn').addEventListener('click', function() {
                    alertModal.close();
            })
            }
        }      
    })
    .catch((error) => {
        console.error('Ошибка:', error);
    });
}
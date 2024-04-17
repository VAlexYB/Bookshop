export const handleLoginFormSubmit = (event) => {
    event.preventDefault(); 
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
        localStorage.setItem('token', data.token);
        const decodedToken = jwt_decode(data.token);
        if(decodedToken.roles.includes('ADMIN')) {
            window.location.href = '/admin/dashboard/dashboard.html';
        }
        else if(decodedToken.roles.includes('CONTENT-MANAGER')) {
            window.location.href = '/manager/dashboard/dashboard.html';
        }           
    })
    .catch((error) => {
        console.error('Ошибка:', error);
    });
}
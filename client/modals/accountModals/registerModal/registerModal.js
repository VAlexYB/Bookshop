export const handleRegisterFormSubmit = (event) => {
    event.preventDefault(); 
    const formData = new FormData(registerForm);
    const surname = formData.get('surname');
    const name = formData.get('name');
    const patronimyc = formData.get('patronimyc');
    const nickname = formData.get('nickname');
    const dateOfBirth = formData.get('dateOfBirth');
    const email = formData.get('email');
    const phoneNumber = formData.get('phoneNumber');
    const username = formData.get('username');
    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm');

    if(password !== passwordConfirm) {
        alert('Пароли не совпадают');
        return;
    }

    const requestData = {
        surname: surname,
        name: name,
        patronimyc: patronimyc,
        nickname: nickname,
        dateOfBirth: dateOfBirth,
        email: email,
        phoneNumber: phoneNumber,
        username: username,
        password: password
    };

    fetch('http://localhost:3000/api/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message); 
        
    })
    .catch((error) => {
        console.error('Ошибка:', error);
    });
};
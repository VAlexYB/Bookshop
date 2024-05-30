document.addEventListener('DOMContentLoaded', () => {
    fetch('/manager/modals/addFileModal/addFileModal.html').then(response => response.text())
    .then((html) => {
        document.body.insertAdjacentHTML('afterbegin', html);
        const addFileBtn = document.getElementById('addFileBtn');
        addFileBtn.addEventListener('click', handleAddFileSubmit);
    });
});

handleAddFileSubmit = (event) => {
    event.preventDefault();
    document.getElementById('addFileModal').close();

    const selectedType = document.getElementById('file-type').value;
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    const bookId = document.getElementById('bookId').value;

    const alertModal = document.getElementById('alertModal');

    if (selectedType === 'book') {
        document.getElementById('alertTitle').innerText = 'Ошибка';
        document.getElementById('alertText').innerText = 'Будет доступно в новых версиях приложения';  
        alertModal.showModal();
        document.getElementById('alertBtn').addEventListener('click', function() {
            alertModal.close();
        })
        return;
    }

    if (!file) {
        document.getElementById('alertTitle').innerText = 'Ошибка';
        document.getElementById('alertText').innerText = 'Добавьте файл';  
        alertModal.showModal();
        document.getElementById('alertBtn').addEventListener('click', function() {
            alertModal.close();
        })
        return;
        return;
    }

    const formData = new FormData();
    formData.append('file', file); 
    formData.append('fileType', selectedType); 
    formData.append('bookId', bookId);
    
    fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData 
    })
    .then(response => response.json())
    .then(data => {
        if (selectedType === 'cover') document.getElementById('alertTitle').innerText = 'Добавление обложки';
        if (selectedType === 'book') document.getElementById('alertTitle').innerText = 'Добавление книги';
        document.getElementById('alertText').innerText = data.message;  
        alertModal.showModal();
        document.getElementById('alertBtn').addEventListener('click', function() {
            alertModal.close();
            location.reload();
        })
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при загрузке файла');
    });
}
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

    if (!selectedType) {
        alert('Пожалуйста, выберите тип файла');
        return;
    }

    if (!file) {
        alert('Пожалуйста, выберите файл');
        return;
    }

    const formData = new FormData();
    formData.append('file', file); 
    formData.append('fileType', selectedType); 
    
    fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при загрузке файла');
    });
}
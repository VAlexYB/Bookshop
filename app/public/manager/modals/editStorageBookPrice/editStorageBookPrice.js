document.addEventListener('DOMContentLoaded', () => {
    fetch('/manager/modals/editStorageBookPrice/editStorageBookPrice.html').then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('afterbegin', html);
            const setPriceBtn = document.getElementById('setPriceBtn');
            setPriceBtn.addEventListener('click', handleSetPriceClick);
        })
});

handleSetPriceClick = (event) => {
    event.preventDefault();
    document.getElementById('priceEditModal').close();
    const requestData = {};
    requestData.price = document.getElementById('price').value;
    requestData.storageId = document.getElementById('storageId').value;

    fetch('http://localhost:3000/api/setPrice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        const alertModal = document.getElementById('alertModal');
        document.getElementById('alertTitle').innerText = 'Установка цены';
        document.getElementById('alertText').innerText = data.message;  
        alertModal.showModal();
        document.getElementById('alertBtn').addEventListener('click', function() {
            alertModal.close();
            location.reload();
        })
    })
    .catch((error) => {
        console.error('Ошибка:', error);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    fetch('/manager/modals/addSupplyModal/addSupplyModal.html').then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('afterbegin', html);
            const addSupplyForm = document.getElementById('addSupplyForm');
            addSupplyForm.addEventListener('submit', handleAddSupplyFormSubmit);
        })
});

handleAddSupplyFormSubmit = (event) => {
    event.preventDefault();
    document.getElementById('supplyModal').close();
    const formData = new FormData(addSupplyForm);

    const requestData = {
        bookId: formData.get('supplyBookId'),
        amount: formData.get('amount')
    };

    fetch('http://localhost:3000/api/addSupply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        const alertModal = document.getElementById('alertModal');
        document.getElementById('alertTitle').innerText = 'Добавление поставки';
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
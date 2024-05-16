document.addEventListener('DOMContentLoaded', () => {
    fetch('/user/modals/createOrderModal/createOrderModal.html').then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('afterbegin', html);
            const cancelBtn = document.getElementById('cancelOrderBtn');
            cancelBtn.addEventListener('click', handleCancelOrderBtnClick);

            const confirmBtn = document.getElementById('confirmOrderBtn');
            confirmBtn.addEventListener('click', handleConfirmOrderBtnClick);
        })
});

handleCancelOrderBtnClick = (event) => {
    event.preventDefault();
    document.getElementById('makeOrderModal').close();
    const bookId = document.getElementById('bookId').value;
    fetch(`http://localhost:3000/api/cancelOrder?id=${bookId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const alertModal = document.getElementById('alertModal');
        document.getElementById('alertTitle').innerText = 'Отмена заказа';
        document.getElementById('alertText').innerText = data.message;  
        alertModal.showModal();
        document.getElementById('alertBtn').addEventListener('click', function() {
            alertModal.close();
        });
    })
}

handleConfirmOrderBtnClick = (event) => {
    event.preventDefault();
    document.getElementById('makeOrderModal').close();
    const bookId = document.getElementById('bookId').value;
    const makeOrderForm = document.getElementById('makeOrderForm');
    const formData = new FormData(makeOrderForm);

    const requestData = {
        bookId: bookId,
        price: document.getElementById('orderCost').innerText,
        recipient: formData.get('recipientName'),
        phone: formData.get('recipientPhone'),
        address: formData.get('autocompleteAddress')
    };

    fetch(`http://localhost:3000/api/confirmOrder`, {
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
        document.getElementById('alertTitle').innerText = 'Оформление заказа';
        document.getElementById('alertText').innerText = data.message;  
        alertModal.showModal();
        document.getElementById('alertBtn').addEventListener('click', function() {
            alertModal.close();
        });
    })
}
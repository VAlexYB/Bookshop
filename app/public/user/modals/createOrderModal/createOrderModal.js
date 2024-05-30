document.addEventListener('DOMContentLoaded', () => {
    fetch('/user/modals/createOrderModal/createOrderModal.html').then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('afterbegin', html);

            const confirmBtn = document.getElementById('confirmOrderBtn');
            confirmBtn.addEventListener('click', handleConfirmOrderBtnClick);
        })
});



handleConfirmOrderBtnClick = (event) => {
    event.preventDefault();
    document.getElementById('makeOrderModal').close();

    const makeOrderForm = document.getElementById('makeOrderForm');
    const formData = new FormData(makeOrderForm);

    const requestData = {
        price: document.getElementById('orderCost').innerText,
        recipient: formData.get('recipientName'),
        phone: formData.get('recipientPhone')
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
document.addEventListener('DOMContentLoaded', function(){
    loadOrders();
});

let currentPage = 1;
const pageSize = 20;
let loadedAfterClick = 0;

window.addEventListener('scroll', () => {
    if(window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100 && loadedAfterClick < 100) {
        loadOrders(currentPage, pageSize);
    }
});


function loadOrders(page = 1, pageSize = 20) {
        const requestData = {
            page: page,
            pageSize: pageSize
        }
        console.log(requestData);
        fetch(`http://localhost:3000/api/filteredOrders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(orders => {
            if(orders.message) {
                const alertModal = document.getElementById('alertModal');
                document.getElementById('alertTitle').innerText = 'Ошибка';
                document.getElementById('alertText').innerText = orders.message;  
                alertModal.showModal();
                document.getElementById('alertBtn').addEventListener('click', function() {
                    alertModal.close();
                });
            }
            const ordersList = document.getElementById('ordersList');
            const template = document.getElementById('orderCardTemplate')
            orders.forEach(order => {
                const orderCard = template.content.cloneNode(true);
                orderCard.getElementById('orderId').textContent = order._id;
                orderCard.getElementById('status').textContent = getStatus(order.status);
                orderCard.getElementById('orderAddress').textContent = order.deliveryAddress;
                orderCard.getElementById('deliveryTime').textContent = order.editDate;
                orderCard.getElementById('orderConfirmDate').textContent = order.creationDate;
                // document.getElementById('orderAddress').textContent = order.deliveryAddress;
                const img = orderCard.querySelector('.book-cover img');
                img.src = order.extension ? `http://localhost:3000/images/covers/${order.bookId}.${order.extension}` : 'http://localhost:3000/images/covers/default.jpg';
                img.alt = order.bookTitle;

                orderCard.querySelector('.book-title').textContent = order.bookTitle;
                orderCard.querySelector('.book-author').textContent = order.author;
                orderCard.getElementById('price').textContent = order.price;

                if(!(parseInt(order.status) > 1)) {
                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-button';
                    const deleteImg = document.createElement('img');
                    deleteImg.src = '/assets/icons/delete.png';
                    deleteImg.style.width = '16px';
                    deleteButton.appendChild(deleteImg);
                    deleteButton.onclick = function() { deleteOrder(order); }; 
                    orderCard.appendChild(deleteButton)
                }
                ordersList.appendChild(orderCard);
            });
            loadedAfterClick += orders.length;
            currentPage++;
            checkLoadMoreButton();
        })
        .catch(error => console.error('Ошибка при загрузке списка книг:', error));
    
};

function checkLoadMoreButton() {
    const loadMoreButton = document.getElementById('loadMoreOrders');
    if(loadedAfterClick >= 100) {
        loadMoreButton.style.display = 'block';
    } else {
        loadMoreButton.style.display = 'none';
    }
}

document.getElementById('loadMoreOrders').addEventListener('click', () => {
    loadOrders(currentPage, pageSize);
    loadedAfterClick = 0;
})

function getStatus(value) {
    const status = orderStatuses.find(status => status.value == value);
    return status ? status.label : 'Ошибка';
}

window.deleteOrder = function (order) {
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
        document.getElementById('confirmTitle').innerText = 'Удаление заказа';
        document.getElementById('confirmText').innerText = `Вы уверены, что хотите удалить заказ "${order._id}"?`;
        confirmModal.showModal();
    
        document.getElementById('confirmBtn').addEventListener('click', function() {
            fetch(`http://localhost:3000/api/deleteOrder?id=${order._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => response.json())
            .then(data => {
                confirmModal.close();
                const alertModal = document.getElementById('alertModal');
                document.getElementById('alertTitle').innerText = 'Удаление книги';
                document.getElementById('alertText').innerText = data.message;  
                alertModal.showModal();
                document.getElementById('alertBtn').addEventListener('click', function() {
                    alertModal.close();
                })
            })
            .catch((error) => {
                console.error('Ошибка:', error);
            });
        });
    }
}
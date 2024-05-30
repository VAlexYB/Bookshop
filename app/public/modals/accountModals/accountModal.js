import { handleLoginFormSubmit } from "./loginModal/loginModal.js";
import { handleRegisterFormSubmit } from "./registerModal/registerModal.js";

export const initAccountModal = () => {
    Promise.all([
        fetch('/modals/accountModals/loginModal/loginModal.html').then(response => response.text()), 
        fetch('/modals/accountModals/registerModal/registerModal.html').then(response => response.text())
    ]).then(([loginHtml, registerHtml]) => {
        document.body.insertAdjacentHTML('beforeend', loginHtml);
        document.body.insertAdjacentHTML('beforeend', registerHtml);
        attachLoginFormEvents();
        attachRegisterFormEvents();
        attachGlobalModalEvents(); 
    });
};

const attachGlobalModalEvents = () => {
    const registerButton = document.getElementById('registerButton');
    const loginButton = document.getElementById('loginButton');
    const registerModal = document.getElementById('registerModal');
    const loginModal = document.getElementById('loginModal');
    const btnOpenAccountModal = document.getElementById('accountBtn'); //кнопка находится в topMenu

    if (registerButton) {
        registerButton.addEventListener('click', function(event) {
            event.preventDefault();
            closeModal();
            openModal(registerModal);
        });
    }

    if (loginButton) {
        loginButton.addEventListener('click', function(event) {
            event.preventDefault();
            closeModal();
            openModal(loginModal);
        });
    }

    console.log(localStorage.getItem('token'))
    if(localStorage.getItem('token')) {
        btnOpenAccountModal.href = "/user/profile/profile.html";
        btnOpenAccountModal.onclick = null;
    } else {
        btnOpenAccountModal.onclick = () => openModal(loginModal);
    }
};

const attachLoginFormEvents = () => {
    const loginForm = document.getElementById('loginForm');
    const btnCloseModals = document.querySelectorAll('.close');

    loginForm.addEventListener('submit', handleLoginFormSubmit);
    btnCloseModals.forEach(btn => btn.addEventListener('click', closeModal));
};

const attachRegisterFormEvents = () => {
    const registerForm = document.getElementById('registerForm');
    const btnCloseModals = document.querySelectorAll('.close');

    registerForm.addEventListener('submit', handleRegisterFormSubmit);
    btnCloseModals.forEach(btn => btn.addEventListener('click', closeModal));
};

const openModal = (modal) => {
    modal.style.display = 'block';
};

const closeModal = () => {
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
};

window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        closeModal();
    }
};
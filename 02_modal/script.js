'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsShowModal = document.querySelectorAll('.show-modal');

function showModal(e) {
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
}



for (let i = 0; i < btnsShowModal.length; i++)
    btnsShowModal[i].addEventListener('click', showModal);



function closeModal() {
    overlay.classList.add('hidden');
    modal.classList.add('hidden');
}

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {

    if (e.key === "Escape" && !modal.classList.contains('hidden')) {
        closeModal();
    } 
})
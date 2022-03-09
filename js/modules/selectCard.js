/* SELECT CARD MODULE */

//* ------------------------------------------------------------------------------------- Imports *//
import { cards_container } from "./elementos.js";

//* ------------------------------------------------------------------------------------- Events *//
cards_container.addEventListener('click', e => {
    if (e.target.classList.contains('card') || e.target.classList.contains('card-content')) {
        const cardid = e.target.dataset.id;
        const card = document.querySelector(`#card-${cardid}`);

        if (card.classList.contains('select'))
            card.classList.remove('select');
        else {
            const selectedcard = document.querySelector('#cards .card.select');
            if (selectedcard) selectedcard.classList.remove('select');
            
            card.classList.add('select');
        }
    }
});

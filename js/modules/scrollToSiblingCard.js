/* SCROLL TO SIBLING CARD MODULE */

//* ------------------------------------------------------------------------------------- Imports *//
import { cards_container, overlay } from "./elementos.js";

//* ------------------------------------------------------------------------------------- Events *//
document.addEventListener('keydown', e => {
    if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
        if (!e.repeat && !overlay.classList.contains('active')) {
            const selectedcard = document.querySelector('.card.select');
            if (selectedcard) {
                e.preventDefault();
                const direction = e.key == 'ArrowUp' ? 'up' : e.key == 'ArrowDown' ? 'down' : false;
                if (direction) scrollToSiblingCard(selectedcard, direction);
            }
        }
    }
});

//* ------------------------------------------------------------------------------------- Functions *//
function scrollToSiblingCard(actualcard, direction) {
    const siblingelement = direction == 'up' ? actualcard.previousElementSibling : direction == 'down' ? actualcard.nextElementSibling : false;

    if (siblingelement?.classList.contains('card')) {
        const siblingcard = siblingelement;
        actualcard.classList.remove('select');
        siblingcard.classList.add('select');
        scrollToCard(siblingcard);
    }
}

function scrollToCard(card) {
    const containercoord = cards_container.getBoundingClientRect();
    const cardcoord = card.getBoundingClientRect();

    const bottomdiff = cardcoord.bottom - containercoord.bottom;    /* Coordenada Inferior De La Tarjeta - Coordenada Inferior Del Contenedor */
    const topdiff = cardcoord.top - containercoord.top;             /* Coordenada Superior De La Tarjeta - Coordenada Superior Del Contenedor */

    if (bottomdiff > 0) cards_container.scrollTop += bottomdiff;
    else if (topdiff < 0) cards_container.scrollTop += topdiff;
}

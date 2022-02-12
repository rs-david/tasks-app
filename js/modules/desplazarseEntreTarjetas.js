import { cards_container } from "./elementos.js";

export function desplazarseALaTarjetaSiguiente(actualcard, direction) {
    const siblingelement = direction == 'up' ? actualcard.previousElementSibling : direction == 'down' ? actualcard.nextElementSibling : false;

    if (siblingelement?.classList.contains('card')) {
        const siblingcard = siblingelement;
        actualcard.classList.remove('select');
        siblingcard.classList.add('select');
        desplazarseA(siblingcard);
    }
}

function desplazarseA(card) {
    const containercoord = cards_container.getBoundingClientRect();
    const cardcoord = card.getBoundingClientRect();

    const bottomdiff = cardcoord.bottom - containercoord.bottom;    /* Coordenada Inferior De La Tarjeta - Coordenada Inferior Del Contenedor */
    const topdiff = cardcoord.top - containercoord.top;             /* Coordenada Superior De La Tarjeta - Coordenada Superior Del Contenedor */

    if (bottomdiff > 0) cards_container.scrollTop += bottomdiff;
    else if (topdiff < 0) cards_container.scrollTop += topdiff;
}

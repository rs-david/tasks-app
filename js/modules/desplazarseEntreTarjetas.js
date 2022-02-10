import { cards_container } from "./elementos.js";
import { deseleccionarTarjeta, seleccionarTarjeta } from "./seleccionarTarjetas.js";

export function desplazarseALaTarjetaSiguiente(direction, selectedcard) {
    const siblingelement = direction == 'up' ? selectedcard.previousElementSibling : direction == 'down' ? selectedcard.nextElementSibling : false;

    if (siblingelement && siblingelement.classList.contains('card')) {
        const siblingcard = siblingelement;
        deseleccionarTarjeta(selectedcard);
        seleccionarTarjeta(siblingcard);
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

export function desplazarseAlPrincipioDeLaLista() {
    cards_container.scrollTop = 0;
}
import { cards_container, overlay } from "./elementosInterfaz.js";

/* Seleccionar Tarjetas */
export function alternarEstadoSeleccionarTarjeta(id) {
    const card = document.querySelector(`#tarjeta-${id}`);

    if (card.classList.contains('select')) {
        deseleccionarTarjeta(card);
    }
    else {
        const selectcard = document.querySelector('.tarjeta.select');
        if (selectcard) deseleccionarTarjeta(selectcard);
        card.classList.add('state', 'select');
    }
}

export function desplazarseEntreTarjetas(e) {
    if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
        if (!overlay.classList.contains('active')) {
            const selectcard = document.querySelector('.tarjeta.select');
            if (selectcard) {
                e.preventDefault();
                if (!e.repeat) {
                    if (e.key == 'ArrowUp') desplazarse('up');
                    else desplazarse('down');
                }
            }
        }
    }
}

function desplazarse(direccion) {
    const cards = document.querySelectorAll('.tarjeta');

    for (let i = 0; i < cards.length; i++) {
        if (cards[i].classList.contains('select')) {
            if (direccion == 'up') {
                if (i > 0) desplazarseTarjetaSiguiente(cards[i], cards[i - 1]);
                return;
            }
            if (direccion == 'down') {
                if (i < cards.length - 1) desplazarseTarjetaSiguiente(cards[i], cards[i + 1]);
                return;
            }
        }
    }
}

function desplazarseTarjetaSiguiente(actual, siguiente) {
    deseleccionarTarjeta(actual);
    seleccionarTarjeta(siguiente);
}

function seleccionarTarjeta(tarjeta) {
    tarjeta.classList.add('state', 'select');

    const cardcoord = tarjeta.getBoundingClientRect();
    const containercoord = cards_container.getBoundingClientRect();
    const distancetop = cardcoord.top - containercoord.top;
    const distancebottom = cardcoord.bottom - containercoord.bottom;

    if (distancetop < 0) cards_container.scrollTop += distancetop;
    if (distancebottom > 0) cards_container.scrollTop += distancebottom;
}

function deseleccionarTarjeta(tarjeta) {
    tarjeta.classList.remove('select');
    setTimeout(() => tarjeta.classList.remove('state'), 1);
}

import { cards_container, overlay } from "./elementos.js";

/* Seleccionar Tarjetas & Desplazarse */
export function alternarEstadoSeleccionarTarjeta(id) {
    const card = document.querySelector(`#tarjeta-${id}`);

    if (card.classList.contains('select')) deseleccionarTarjeta(card);
    else {
        const selectcard = document.querySelector('.tarjeta.select');
        if (selectcard) deseleccionarTarjeta(selectcard);
        seleccionarTarjeta(card);
    }
}

export function desplazarseEntreTarjetas(e) {
    if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
        if (!overlay.classList.contains('active')) {
            const selectcard = document.querySelector('.tarjeta.select');
            if (selectcard) {
                e.preventDefault();
                if (!e.repeat) {
                    if (e.key == 'ArrowUp') desplazarseTarjetaSiguiente('up');
                    else desplazarseTarjetaSiguiente('down');
                }
            }
        }
    }
}

function desplazarseTarjetaSiguiente(posicion) {
    const selectcard = document.querySelector('.tarjeta.select');
    const nextcard = posicion == 'up' ? selectcard.previousElementSibling : selectcard.nextElementSibling;
    if (nextcard && nextcard.classList.contains('tarjeta')) {
        deseleccionarTarjeta(selectcard);
        seleccionarTarjeta(nextcard);
        desplazarse(nextcard);
    }
}

function seleccionarTarjeta(tarjeta) {
    tarjeta.classList.add('avoid', 'select');
}

function deseleccionarTarjeta(tarjeta) {
    tarjeta.classList.remove('select');
    setTimeout(() => tarjeta.classList.remove('avoid'), 1);
}

function desplazarse(tarjeta) {
    const cardcoord = tarjeta.getBoundingClientRect();
    const containercoord = cards_container.getBoundingClientRect();
    const distancetop = cardcoord.top - containercoord.top;
    const distancebottom = cardcoord.bottom - containercoord.bottom;

    if (distancetop < 0) return cards_container.scrollTop += distancetop;
    if (distancebottom > 0) cards_container.scrollTop += distancebottom;
}

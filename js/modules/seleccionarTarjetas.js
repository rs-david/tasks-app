/* Seleccionar Tarjetas & Desplazarse */
export function alternarEstadoSeleccionarTarjeta(card) {
    if (card.classList.contains('select')) deseleccionarTarjeta(card);
    else {
        const selectedcard = document.querySelector('.card.select');
        if (selectedcard) deseleccionarTarjeta(selectedcard);

        seleccionarTarjeta(card);
    }
}

export function seleccionarTarjeta(card) {
    card.classList.add('select');
}

export function deseleccionarTarjeta(card) {
    card.classList.remove('select');
}

/* Manipular Estado Seleccionar Tarjeta */
export function alternarEstadoSeleccionarTarjeta(elemento) {
    const card = document.querySelector(`#tarjeta-${elemento.dataset.id}`);

    if (card.classList.contains('select')) card.classList.remove('select');
    else {
        const selectcard = document.querySelector('.tarjeta.select');
        if (selectcard) selectcard.classList.remove('select');
        card.classList.add('select');
    }
}

export function desplazarseEntreTarjetas(e) {
    const cards = document.querySelectorAll('.tarjeta');
    const selectedcard = document.querySelector('.tarjeta.select');

    if (e.key == 'ArrowUp' && selectedcard) {
        e.preventDefault();

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            if (card.classList.contains('select') && i > 0) {
                const cardup = cards[i - 1];
                card.classList.remove('select');
                cardup.classList.add('select');
                return;
            }
        }
    }

    if (e.key == 'ArrowDown' && selectedcard) {
        e.preventDefault();

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            if (card.classList.contains('select') && i < cards.length - 1) {
                const carddown = cards[i + 1];
                card.classList.remove('select');
                carddown.classList.add('select');
                return;
            }
        }
    }
}

/* Funciones Interfaz */
export function enableElement(element) {
    element.removeAttribute('disabled', true);
}

export function disableElement(element) {
    element.setAttribute('disabled', true);
}

export function vaciarElemento(element) {
    element.innerHTML = "";
}

export function enfocarElemento(elemento) {
    elemento.focus();
}

/* Funciones Font Awesome */
export function cambiarIcono(elemento, quitar, agregar) {
    if (typeof quitar == 'object') for (const icono of quitar) elemento.classList.remove(icono);
    else elemento.classList.remove(quitar);

    if (typeof agregar == 'object') for (const icono of agregar) elemento.classList.add(icono);
    else elemento.classList.add(agregar);
}
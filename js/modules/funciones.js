/* Funciones Interfaz */
export function agregarClaseCSS(elemento, clase) {
    elemento.classList.add(clase);
}

export function removerClase(elemento, clase) {
    elemento.classList.remove(clase);
}

export function habilitarElemento(elemento) {
    elemento.removeAttribute('disabled', true);
}

export function deshabilitarElemento(elemento) {
    elemento.setAttribute('disabled', true);
}

export function cambiarIcono(elemento, quitar, agregar) {
    if (typeof quitar == 'object') for (const icono of quitar) elemento.classList.remove(icono);
    else elemento.classList.remove(quitar);

    if (typeof agregar == 'object') for (const icono of agregar) elemento.classList.add(icono);
    else elemento.classList.add(agregar);
}

export function cambiarContenido(contenedor, contenido) {
    contenedor.innerHTML = contenido;
}

export function limpiarElemento(element) {
    element.innerHTML = "";
}

export function agregarContenido(contenedor, contenido) {
    contenedor.innerHTML += contenido;
}

export function enfocarElemento(elemento) {
    elemento.focus();
}

/* Funciones Interfaz */
export function agregarClase(elemento, clase) {
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

export function marcarCasillas(elementos) {
    for (const elemento of elementos) elemento.checked = true;
}

export function cambiarIcono(elemento, quitar, agregar) {
    if (typeof quitar == 'object') for (const clase of quitar) elemento.classList.remove(clase);
    else elemento.classList.remove(quitar);

    if (typeof agregar == 'object') for (const clase of agregar) elemento.classList.add(clase);
    else elemento.classList.add(agregar);
}

export function cambiarContenido(contenedor, contenido) {
    contenedor.innerHTML = contenido;
}

export function agregarContenido(contenedor, contenido) {
    contenedor.innerHTML += contenido;
}

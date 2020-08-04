/* --------------- INTERFAZ --------------- */

export function cambiarIcono(elemento, quitar, agregar) {
    if (typeof quitar == 'object')
        for (const clase of quitar)
            elemento.classList.remove(clase);
    else
        elemento.classList.remove(quitar);

    if (typeof agregar == 'object')
        for (const clase of agregar)
            elemento.classList.add(clase);
    else
        elemento.classList.add(agregar);
}

export function agregarEstado(elemento, estado) {
    elemento.classList.add(estado);
}

export function quitarEstado(elemento, estado) {
    elemento.classList.remove(estado);
}

export function habilitarElemento(elemento) {
    elemento.removeAttribute('disabled', true);
}

export function deshabilitarElemento(elemento) {
    elemento.setAttribute('disabled', true);
}

export function activarElemento(elemento) {
    elemento.classList.add('active');
}

export function activarElementos(elementos) {
    for (const elemento of elementos)
        elemento.classList.add('active');
}

export function desactivarElemento(elemento) {
    elemento.classList.remove('active');
}

export function desactivarElementos(elementos) {
    for (const elemento of elementos)
        elemento.classList.remove('active');
}

export function cambiarTexto(elemento, texto) {
    elemento.textContent = texto;
}

export function cambiarTitle(elemento, titulo) {
    elemento.title = titulo;
}

export function cambiarName(elemento, nombre) {
    elemento.name = nombre;
}

export function cambiarValue(elemento, valor) {
    elemento.value = valor;
}

export function vaciarFormulario(formulario) {
    formulario.reset();
}

export function marcarCasillas(elementos) {
    for (const elemento of elementos) elemento.checked = true;
}

export function desmarcarElemento(elemento) {
    elemento.checked = false;
}

export function enfocarElemento(elemento) {
    elemento.focus();
}

export function cambiarContenido(contenedor, contenido) {
    contenedor.innerHTML = contenido;
}

export function agregarContenido(contenedor, contenido) {
    contenedor.innerHTML += contenido;
}

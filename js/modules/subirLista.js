import { buscarTareas } from "./buscarTareas.js";
import { upload_form, upload_button, upload_field, upload_fieldtext, upload_icon } from "./elementos.js";
import { cambiarIcono, deshabilitarElemento, habilitarElemento } from "./funciones.js";
import { mostrarNotificacion } from "./notificaciones.js";

/* Subir Lista */
export async function subirLista(lista) {
    iniciarEstadoSubiendo();
    
    const response = await enviarListaAlServidor(lista);
    if (!response.error) await buscarTareas();
    else console.log(response.error);

    terminarEstadoSubiendo();
    desactivarEstadoSubir();
    mostrarNotificacion(response.content, response.type, 3500);
}

async function enviarListaAlServidor(lista) {
    const data = new FormData();
    data.append('file', lista);
    let response = await fetch('list-upload.php', { method: 'post', body: data });
        response = await response.json();

    return response;
}

/* Estado Subir:
    - "Campo" Buscar Lista "Cambia de Apariencia".
    - Se Muestra el "Nombre del Archivo" a Subir.
    - "Botón" Subir Lista "Cambia de Apariencia" y se "Activa".
*/

export function activarEstadoSubir(file) {
    upload_field.classList.add('active');
    upload_fieldtext.textContent = file.name;
    if (upload_button.hasAttribute('disabled')) habilitarElemento(upload_button);
}

export function desactivarEstadoSubir() {
    upload_field.classList.remove('active');
    upload_fieldtext.textContent = 'Buscar Lista';
    if (!upload_button.hasAttribute('disabled')) deshabilitarElemento(upload_button);
}

/* Estado Subiendo:
    - Se Desabilitan El Campo Para Subir Archivos & Cambia De Apariencia.
    - Cambia El Texto Del Campo A "Subiendo...".
    - Se Deshabilita El Botón Que Envia Los Archivos & Cambia De Aparencia.
    - Cambia El Icono Del Botón.
*/

function iniciarEstadoSubiendo() {
    /* Campo Subir Lista */
    upload_field.classList.add('uploading');
    upload_fieldtext.textContent = 'Subiendo...';
    /* Botón */
    deshabilitarElemento(upload_button);
    upload_button.classList.add('uploading');
    cambiarIcono(upload_icon, 'fa-paper-plane', ['fa-cog', 'fa-spin']);
}

function terminarEstadoSubiendo() {
    /* Campo Subir Lista */
    upload_form.reset();
    upload_field.classList.remove('uploading');
    /* Botón */
    upload_button.classList.remove('uploading');
    cambiarIcono(upload_icon, ['fa-cog', 'fa-spin'], 'fa-paper-plane');
}

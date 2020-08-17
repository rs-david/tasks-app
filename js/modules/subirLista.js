import { upload_input, upload_form, upload_button, upload_field, upload_fieldtext, upload_icon } from "./elementos.js";
import { cambiarIcono, deshabilitarElemento, habilitarElemento } from "./funciones.js";
import { listarTareas } from "./listarTareas.js";
import { mostrarNotificacion } from "./notificaciones.js";

/* Subir Lista */
export function alternarEstadoSubir() {
    const file = upload_input.files[0];
    if (file) activarEstadoSubir(file);
    else {
        if (!upload_button.hasAttribute('disabled')) desactivarEstadoSubir(true);
        else desactivarEstadoSubir();
    }
}

export async function subirLista(lista) {
    iniciarEstadoSubiendo();

    const message = await subir(lista);
    if (!message.error) await listarTareas();
    else console.log(message.error);

    terminarEstadoSubiendo();
    desactivarEstadoSubir();
    mostrarNotificacion(message.content, message.type);
}

async function subir(lista) {
    const data = new FormData();
    data.append('file', lista);
    const response = await fetch('list-upload.php', { method: 'post', body: data });
    const message = await response.json();

    return message;
}

function activarEstadoSubir(file) {
    habilitarElemento(upload_button);
    upload_field.classList.add('active');
    upload_field.title = file.name;
    upload_fieldtext.textContent = file.name;
    upload_fieldtext.title = file.name;
}

function desactivarEstadoSubir(boton) {
    if (boton) deshabilitarElemento(upload_button);
    upload_field.classList.remove('active');
    upload_field.title = 'Buscar Lista';
    upload_fieldtext.title = 'Buscar Lista';
    upload_fieldtext.textContent = 'Buscar Lista';
}

function iniciarEstadoSubiendo() {
    deshabilitarElemento(upload_button);
    upload_button.classList.add('uploading');
    cambiarIcono(upload_icon, 'fa-paper-plane', ['fa-cog', 'fa-spin']);
    upload_field.classList.add('uploading');
    upload_fieldtext.textContent = 'Subiendo...';
}

function terminarEstadoSubiendo() {
    upload_form.reset();
    upload_field.classList.remove('uploading');
    upload_button.classList.remove('uploading');
    cambiarIcono(upload_icon, ['fa-cog', 'fa-spin'], 'fa-paper-plane');
}

import { upload_input, upload_form, upload_button, upload_field, upload_fieldtext, upload_icon } from "./elementosInterfaz.js";
import { cambiarIcono, deshabilitarElemento, habilitarElemento } from "./funcionesInterfaz.js";
import { listarTareas } from "./listarTareas.js";
import { mostrarNotificacion } from "./notificaciones.js";

/* Subir Lista */
export function alternarEstadoSubir() {
    const file = upload_input.files[0] ? upload_input.files[0] : false;

    if (file) activarEstadoSubir(file);
    else {
        if (!upload_button.hasAttribute('disabled')) desactivarEstadoSubir(true);
        else desactivarEstadoSubir();
    }
}

export async function subirLista(lista) {
    activarEstadoSubiendo();

    const message = await guardarLista(lista);
    if (message.content == '¡Lista Guardada!') await listarTareas();
    else if (message.error) console.log(message.error);

    desactivarEstadoSubiendo();
    desactivarEstadoSubir();
    mostrarNotificacion(message.content, message.type);
}

async function guardarLista(lista) {
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

function activarEstadoSubiendo() {
    deshabilitarElemento(upload_button);
    upload_button.classList.add('uploading');
    cambiarIcono(upload_icon, 'fa-paper-plane', ['fa-cog', 'fa-spin']);
    upload_field.classList.add('uploading');
    upload_fieldtext.textContent = 'Subiendo...';
}

function desactivarEstadoSubiendo() {
    upload_form.reset();
    upload_field.classList.remove('uploading');
    upload_button.classList.remove('uploading');
    cambiarIcono(upload_icon, ['fa-cog', 'fa-spin'], 'fa-paper-plane');
}

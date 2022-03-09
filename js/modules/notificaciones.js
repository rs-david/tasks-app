/* NOTIFICATIONS MODULE */

//* ------------------------------------------------------------------------------------- Imports *//
import { list, headers } from "./elementos.js";

//* ------------------------------------------------------------------------------------- Events *//
list.addEventListener('click', e => {
    if (e.target.classList.contains('notificacion')) {
        cerrarNotificacion(e.target);
    }
});

//* ------------------------------------------------------------------------------------- Functions *//
export function mostrarNotificacion(mensaje, tipo, tiempo) {
    const notification = crearNotificacion(mensaje, tipo);
    const time = tiempo ? tiempo : 2500;
    list.insertBefore(notification, headers);
    setTimeout(() => cerrarNotificacion(notification), time);
}

function crearNotificacion(mensaje, tipo) {
    const notification = document.createElement("div");
    notification.className = `notificacion ${tipo}`;
    notification.textContent = mensaje;
    notification.title = 'Cerrar Notificación';
    return notification;
}

function cerrarNotificacion(notificacion) {
    notificacion.remove();
}

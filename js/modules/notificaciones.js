import { list, headers } from "./elementos.js";

/* Notificaciones */
function crearNotificacion(mensaje, tipo) {
    const notification = document.createElement("div");
    notification.className = `notificacion ${tipo}`;
    notification.textContent = mensaje;
    notification.title = 'Cerrar Notificación';
    return notification;
}

export function mostrarNotificacion(mensaje, tipo, tiempo) {
    const notification = crearNotificacion(mensaje, tipo);
    const time = tiempo ? tiempo : 2500;
    list.insertBefore(notification, headers);
    setTimeout(() => cerrarNotificacion(notification), time);
}

export function cerrarNotificacion(notificacion) {
    notificacion.remove();
}

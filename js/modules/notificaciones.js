import { list, headers } from "./elementos.js";

/* Notificaciones */
function crearNotificacion(mensaje, tipo) {
    const notification = document.createElement("div");
    notification.className = `notificacion ${tipo}`;
    notification.textContent = mensaje;
    notification.title = 'Cerrar';
    return notification;
}

export function mostrarNotificacion(mensaje, tipo) {
    const notification = crearNotificacion(mensaje, tipo);
    list.insertBefore(notification, headers);
    setTimeout(() => cerrarNotificacion(notification), 2500);
}

export function cerrarNotificacion(notificacion) {
    notificacion.remove();
}

import { list, headers } from "./elementos.js";

/* Notificaciones */
export function mostrarNotificacion(mensaje, tipo) {
    const notification = document.createElement("div");
    notification.className = `notificacion ${tipo}`;
    notification.textContent = mensaje;

    list.insertBefore(notification, headers);
    setTimeout(() => cerrarNotificacion(notification), 2500);
}

export function cerrarNotificacion(notificacion) {
    notificacion.remove();
}

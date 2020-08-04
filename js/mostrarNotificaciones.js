/* --------------- NOTIFICACIONES --------------- */
/* Funciones */
export function mostrarNotificacion(mensaje, tipo) {
    const notification = document.createElement("div");
    notification.className = `notificacion ${tipo}`;
    const message = document.createTextNode(mensaje);
    notification.appendChild(message);

    const lista = document.querySelector('.lista');
    const encabezados = document.querySelector('.encabezados');
    lista.insertBefore(notification, encabezados);
    setTimeout(() => cerrarNotificacion(notification), 2500);
}
function cerrarNotificacion(notificacion) {
    notificacion.remove();
}

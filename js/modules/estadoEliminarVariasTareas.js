import { multiple_delete_button } from "./elementos.js";
import { deshabilitarElemento, habilitarElemento } from "./funciones.js";
import { actualizarContadorTareasSeleccionadas } from "./actualizarContadores.js";

/* Manipular Estado "Eliminar Múltiples Tareas" */
export function alternarEstadoEliminarVariasTareas() {
    const checkedcheckboxes = document.querySelectorAll('.tarjeta .checkbox:checked');

    if (checkedcheckboxes.length > 0) habilitarElemento(multiple_delete_button);
    else deshabilitarElemento(multiple_delete_button);
    
    actualizarContadorTareasSeleccionadas(checkedcheckboxes.length);
}

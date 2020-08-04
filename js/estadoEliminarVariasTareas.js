import { multiple_button } from "./elementosInterfaz.js";
import { deshabilitarElemento, habilitarElemento } from "./funcionesInterfaz.js";
import { actualizarContadorTareasSeleccionadas } from "./actualizarContadores.js";

/* Manipular Estado "Eliminar Múltiples Tareas" */
export function alternarEstadoEliminarVariasTareas() {
    const checkedcheckboxes = document.querySelectorAll('.tarjeta .checkbox:checked');

    actualizarContadorTareasSeleccionadas(checkedcheckboxes.length);
    
    if (checkedcheckboxes.length > 0) habilitarElemento(multiple_button);
    else deshabilitarElemento(multiple_button);
}

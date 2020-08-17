import { counter_selection, counter_results, counter_totals } from "./elementos.js";
import { cambiarContenido } from "./funciones.js";

/* Actualizar Contadores */
export function actualizarContadores(total, resultados, seleccion) {
    actualizarContadorTareasSeleccionadas(seleccion);
    actualizarContadorTareasEncontradas(resultados);
    actualizarContadorTareasTotales(total);
}

export function actualizarContadorTareasSeleccionadas(cantidad) {
    cambiarContenido(counter_selection, cantidad);
}

function actualizarContadorTareasEncontradas(resultados) {
    cambiarContenido(counter_results, resultados);
}

function actualizarContadorTareasTotales(total) {
    cambiarContenido(counter_totals, total);
}

import { search_description, search_id, search_name } from "./elementos.js";
import { listarTareas } from "./listarTareas.js";

/* Funciones Para Buscar Tareas */

// Se usa buscarTareas() cuando queremos Listar Tareas con Datos de Búsqueda o Filtrado.

// Formato: listdata = { limit, column, sort }
export async function buscarTareas(listdata) {
    const id = search_id.value;
    const name = search_name.value;
    const description = search_description.value;
    const searchdata = { id, name, description };
    
    await listarTareas(listdata, searchdata);
}

/* CAMBIAR SAVE INPUTS */
import { save_button, save_form } from "./elementos.js";
import { _tables } from "./variables.js";

export function changeSaveInputs(table) {
    /* Eliminar Inputs Actuales */
    const actualinputs = document.querySelectorAll('#save-form input');
    if (actualinputs) for (const input of actualinputs) input.remove();
    
    /* Crear Inputs Nuevos */
    const memoryinputs = _tables[table].saveinputs;
    const newinputs = [];
    if (memoryinputs.length > 0) {
        for (const memoryinput of memoryinputs) {
            const newinput = createSaveInput(memoryinput);
            newinputs.push(newinput);
        }
    }
    
    /* Insertar Inputs Nuevos al Formulario de Guardado */
    if (newinputs.length > 0) {
        for (const newinput of newinputs) {
            save_form.insertBefore(newinput, save_button);
        }
    }
}

function createSaveInput(memoryinput) {
    const saveinput = document.createElement("input");
    saveinput.id = `save-${memoryinput}`;
    saveinput.className = `save-${memoryinput} form-input`;
    saveinput.name = memoryinput;
    const typeinput = memoryinput == 'id' || memoryinput == 'price' || memoryinput == 'quantity' ? 'number' : memoryinput == 'created' ? 'datetime-local' : 'text';
    saveinput.type = typeinput;
    const typesave = memoryinput == 'id' ? 'Clave:' : memoryinput == 'name' ? 'Nombre:' : memoryinput == 'description' ? 'Descripción:' : memoryinput == 'price' ? 'Precio:' : memoryinput == 'quantity' ? 'Cantidad' : '';
    saveinput.placeholder = `${typesave}`;
    const requiredordisabledatt = memoryinput == 'id' || memoryinput == 'created' ? 'disabled' : 'required';
    saveinput.setAttribute(requiredordisabledatt, true);
    return saveinput;
}

/* CAMBIAR SAVE INPUTS */
import { save_button, save_form } from "./elementos.js";
import { _tables } from "./variables.js";

export function loadSaveInputs(table) {
    /* Remover Save Form Groups Actuales | Save Form Group = Save Input + Label */
    const actualformgroups = document.querySelectorAll('#save-form .form-group');
    for (const actualformgroup of actualformgroups) actualformgroup.remove();

    /* Crear Save Form Groups Nuevos */
    const inputnames = _tables[table].saveinputs;
    const newformgroups = inputnames.map(inputname => createFormGroup(inputname));

    /* Insertar Save Form Groups Nuevos */
    for (const newformgroup of newformgroups) save_form.insertBefore(newformgroup, save_button);
}

function createFormGroup(inputname) {
    /* Create Form Group Container */
    const formgroup = document.createElement("div");
    formgroup.className = 'form-group';

    /* Create & Insert Label In Form Group */
    const savelabel = document.createElement("label");
    savelabel.setAttribute('for', `save-${inputname}`);
    const typesave = inputname == 'id' ? 'Clave' : inputname == 'name' ? 'Nombre' : inputname == 'description' ? 'Descripción' : inputname == 'price' ? 'Precio' : inputname == 'quantity' ? 'Cantidad' : '';
    savelabel.textContent = `${typesave}:`;
    formgroup.append(savelabel);

    /* Create & Insert Save Input In Form Group */
    const saveinput = document.createElement("input");
    saveinput.id = `save-${inputname}`;
    saveinput.className = `save-${inputname} form-input`;
    saveinput.name = inputname;
    const typeinput = inputname == 'id' || inputname == 'price' || inputname == 'quantity' ? 'number' : inputname == 'created' ? 'datetime-local' : 'text';
    saveinput.type = typeinput;
    const requiredordisabledatt = inputname == 'id' || inputname == 'created' ? 'disabled' : 'required';
    saveinput.setAttribute(requiredordisabledatt, true);
    formgroup.append(saveinput);

    return formgroup;
}

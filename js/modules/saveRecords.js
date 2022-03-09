/* SAVE/UPDATE RECORDS MODULE */

//* ------------------------------------------------------------------------------------- Imports *//
import { _tables } from './variables.js';
import { save_button, save_form } from './elementos.js';
import { cambiarIcono, disableElement, enableElement } from "./funciones.js";
import { cancelUpdate } from "./prepareUpdate.js";
import { mostrarNotificacion } from "./notificaciones.js";
import { listRecords } from "./listRecords.js";

//* ------------------------------------------------------------------------------------- Events *//
save_form.addEventListener('submit', e => {
  saveRecords();
  e.preventDefault();
});

//* ------------------------------------------------------------------------------------- Functions *//
async function saveRecords() {
  const table = _tables.current;
  const record = createRecord();

  if (record) {
    iniciarEstadoGuardando();

    const editcard = document.querySelector('#cards .card.edit');
    const id = editcard ? editcard.dataset.id : false;
    const url = _tables[table].savedata.savemode === 'update' ? 'update-records.php' : 'add-records.php';
    const savedata = url === 'update-records.php' ? { id, table, record } : url === 'add-records.php' ? { table, record } : false;
    const response = await saveRecord(savedata, url);

    if (response.error) console.log(response.error);
    else await listRecords();

    if (_tables[table].savedata.savemode === 'update') cancelUpdate(table);
    else if (_tables[table].savedata.savemode === 'add') save_form.reset();

    terminarEstadoGuardando();
    mostrarNotificacion(response.content, response.type);
  } else {
    mostrarNotificacion('¡Error Al Crear Registro!', 'danger');
  }
}

function createRecord() {
  const saveinputs = document.querySelectorAll('#save-form input');
  const record = {};

  for (const saveinput of saveinputs) {
    const { name } = saveinput;
    const { value } = saveinput;
    record[name] = value;
  };
  
  return record;
}

async function saveRecord(savedata, url) {
  const data = new FormData();
  data.append('data', JSON.stringify(savedata));
  const response = await fetch(url, { method: 'post', body: data });
  const message = await response.json();
  return message;
}

function iniciarEstadoGuardando() {
  const icon = document.querySelector('#icon-save');
  disableElement(save_button);
  cambiarIcono(icon, 'fa-save', ['fa-cog', 'fa-spin']);
}

function terminarEstadoGuardando() {
  const icon = document.querySelector('#icon-save');
  enableElement(save_button);
  cambiarIcono(icon, ['fa-cog', 'fa-spin'], 'fa-save');
}

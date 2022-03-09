/* PREPARE UPDATE MODULE */

//* --------------------------------------------------------------------------- Imports *//
import { _tables } from './variables.js';
import { save_form, save_button, cards_container, overlay } from './elementos.js';
import { mostrarNotificacion } from './notificaciones.js';
import { $ } from './selectores.js';

//* --------------------------------------------------------------------------- Events *//
cards_container.addEventListener('click', (e) => {
  if (e.target.classList.contains('boton-editar') || e.target.classList.contains('icono-editar')) {
    const table = _tables.current;
    const recordid = e.target.dataset.id;
    toggleUpdate(table, recordid);
    e.preventDefault();
  }
});
document.addEventListener('keydown', (e) => {
  const table = _tables.current;
  const { savemode } = _tables[table].savedata;
  // escape
  if (e.key === 'Escape' && savemode === 'update' && !overlay.classList.contains('active')) {
    e.preventDefault();
    if (!e.repeat) cancelUpdate(table);
  }
  // ctrl + e
  if (e.ctrlKey && e.code === 'KeyE' && !overlay.classList.contains('active')) {
    e.preventDefault();
    const selectedcard = document.querySelector('.card.select');
    if (selectedcard && !e.repeat) {
      const recordid = selectedcard.dataset.id;
      toggleUpdate(table, recordid);
    }
  }
});

//* --------------------------------------------------------------------------- Functions *//
export async function toggleUpdate(table, recordid) {
  if (_tables[table].savedata.savemode === 'add') {
    prepareUpdate(table, recordid);
  } else if (_tables[table].savedata.savemode === 'update') {
    const card = $(`#card-${recordid}`);
    if (card && card.classList.contains('edit')) {
      cancelUpdate(table);
    } else {
      resetCard();
      prepareUpdate(table, recordid);
    }
  }
}

export async function prepareUpdate(table, recordid) {
  const record = await getRecord(table, recordid);
  if (!record.error) {
    modifyCard(recordid);
    modifySaveButton();
    fillSaveForm(table, record);
    updateSaveData(table, recordid);
  } else {
    mostrarNotificacion('¡Error En El Servidor!', 'danger');
  }
}

export function cancelUpdate(table) {
  resetCard();
  resetSaveButton();
  resetSaveForm();
  resetSaveData(table);
}

async function getRecord(table, id) {
  const data = new FormData();
  data.append('data', JSON.stringify({ id, table }));
  const response = await fetch('get-record-info.php', { method: 'post', body: data });
  const record = await response.json();
  return record;
}

function modifyCard(cardid) {
  const card = document.querySelector(`#card-${cardid}`);
  if (card) card.classList.add('edit');
}

function modifySaveButton() {
  save_button.classList.remove('success');
  save_button.classList.add('warning');
  save_button.title = 'Guardar Cambios';
}

function fillSaveForm(table, record) {
  const inputnames = _tables[table].saveinputs;
  const recordentries = Object.entries(record);

  for (const [key, value] of recordentries) {
    if (inputnames.includes(key)) {
      const saveinput = document.querySelector(`#save-${key}`);
      saveinput.value = value;
    }
  };
}

function updateSaveData(table, cardid) {
  _tables[table].savedata.savemode = 'update';
  _tables[table].savedata.cardid = cardid;
}

function resetCard() {
  const card = document.querySelector('.card.edit');
  if (card) card.classList.remove('edit');
}

export function resetSaveButton() {
  save_button.classList.remove('warning');
  save_button.classList.add('success');
  save_button.title = 'Guardar Registro';
}

function resetSaveForm() {
  save_form.reset();
}

function resetSaveData(table) {
  _tables[table].savedata.savemode = 'add';
  _tables[table].savedata.cardid = 0;
}

/* NOTIFICATIONS MODULE */

//* ------------------------------------------------------------------------------------- Imports *//
import { _tables } from "./variables.js";
import { mdelete_button, listdelete_radio, memorydelete_radio, headers_checkbox, listselection_counter, memoryselection_counter, cards_container, mdelete_form } from "./elementos.js";
import { disableElement, enableElement } from "./funciones.js";
import { $, $$ } from "./selectores.js";

//* ------------------------------------------------------------------------------------- Events *//
headers_checkbox.addEventListener('change', (e) => {
  const checkboxes = $$('.card-checkbox input[type="checkbox"]');
  if (checkboxes.length > 0) {
    const checkbox = e.target;
    updateMultipleDeleteStatus(_tables.current, checkbox, checkboxes, true);
  }
});
cards_container.addEventListener('change', (e) => {
  if (e.target.type === 'checkbox') {
    const checkbox = e.target;
    updateMultipleDeleteStatus(_tables.current, checkbox, [checkbox]);
  }
});
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !e.repeat) {
    const selectedcard = $('.card.select');
    if (selectedcard) {
      e.preventDefault();
      const checkbox = $('.card.select input[type="checkbox"]');
      updateCheckbox(checkbox, !checkbox.checked);
      updateMultipleDeleteStatus(_tables.current, checkbox, [checkbox]);
    }
  }
});
mdelete_form.addEventListener('change', (e) => {
  if (e.target.type === 'radio') {
    updateMultipleDeleteButton(_tables.current);
  }
});

export function updateMultipleDeleteStatus(table, launcher, checkboxes, ishandler) {
  if (launcher && launcher.type === 'checkbox' && checkboxes) {
    for (const checkbox of checkboxes) {
      // checkboxes
      if (ishandler) updateCheckbox(checkbox, launcher.checked);
      // memory
      updateMemory(table, checkbox.dataset.id, launcher.checked);
    }
  }
  // master checkbox
  updateMasterCheckbox();
  // button
  updateMultipleDeleteButton(table);
  // counters
  updateListSelectionCounter();
  updateMemoryCounter(table);
}

function updateMemory(table, key, add) {
  if (add) addKeyToMemoryKeys(table, key);
  else removeKeyFromMemoryKeys(table, key);
}

function updateCheckbox(checkbox, status) {
  checkbox.checked = status;
}

function addKeyToMemoryKeys(table, key) {
  _tables[table].delete.keys.memory.push(key);
}

function removeKeyFromMemoryKeys(table, key) {
  _tables[table].delete.keys.memory = _tables[table].delete.keys.memory.filter((memorykey) => memorykey != key);
}

function updateMasterCheckbox() {
  const mastercheckbox = headers_checkbox;
  const checkboxes = $$('.card-checkbox input[type="checkbox"]');
  const checkedcheckboxes = $$('.card-checkbox input[type="checkbox"]:checked');

  /* Si Todos Los Checkboxes Están Seleccionados */
  if (checkboxes.length > 0 && checkboxes.length === checkedcheckboxes.length) {
    mastercheckbox.checked = true;
    mastercheckbox.classList.remove('minus');
    /* Si Sólo Algunos Checkboxes Están Seleccionados */
  } else if (checkedcheckboxes.length > 0 && checkedcheckboxes.length < checkboxes.length) {
    mastercheckbox.checked = true;
    mastercheckbox.classList.add('minus');
    /* Si No Hay Checkboxes Seleccionados */
  } else if (checkedcheckboxes.length === 0) {
    mastercheckbox.checked = false;
  }
}

function updateMultipleDeleteButton(table) {
  /* Si Está Activada La Eliminación En Lista */
  if (listdelete_radio.checked) {
    const checkedcheckboxes = $$('.card-checkbox input[type="checkbox"]:checked');
    if (checkedcheckboxes.length > 0) enableElement(mdelete_button);
    else if (checkedcheckboxes.length <= 0) disableElement(mdelete_button);
    /* Si Está Activada La Eliminación En Memoria */
  } else if (memorydelete_radio.checked) {
    const memorykeys = _tables[table].delete.keys.memory;
    if (memorykeys.length > 0) enableElement(mdelete_button);
    else if (memorykeys.length <= 0) disableElement(mdelete_button);
  }
}

function updateListSelectionCounter() {
  const checkedcheckboxes = $$('.card .custom-checkbox:checked');
  listselection_counter.innerHTML = checkedcheckboxes.length;
}

function updateMemoryCounter(table) {
  const memorykeys = _tables[table].delete.keys.memory;
  memoryselection_counter.innerHTML = memorykeys.length;
}

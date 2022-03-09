/* UPLOAD JSON LIST MODULE */

//* ------------------------------------------------------------------------------------- Imports *//
import { upload_form, upload_button, upload_field, upload_fieldtext, upload_icon, upload_input } from "./elementos.js";
import { cambiarIcono, disableElement, enableElement } from "./funciones.js";
import { listRecords } from "./listRecords.js";
import { mostrarNotificacion } from "./notificaciones.js";
import { _tables } from "./variables.js";

//* ------------------------------------------------------------------------------------- Events *//
upload_input.addEventListener('change', (e) => {
  const fileinput = e.target;
  const file = fileinput.files[0];
  if (file) enableUpload(file);
  else disableUpload();
});

upload_form.addEventListener('submit', (e) => {
  const file = upload_input.files[0];
  if (file) uploadJsonList(file);
  else {
    mostrarNotificacion('Selecciona Antes Un Archivo', 'warning', 3500);
    if (!upload_button.hasAttribute('disabled')) disableElement(upload_button);
  }
  e.preventDefault();
});

//* ------------------------------------------------------------------------------------- Funtions *//
async function uploadJsonList(json) {
  startUploading();
  const table = _tables.current;
  const response = await uploadToDB(json, table);

  if (!response.error) await listRecords();

  finishUploading();
  disableUpload();
  mostrarNotificacion(response.content, response.type, 3500);
}

async function uploadToDB(lista, table) {
  const data = new FormData();
  data.append('file', lista);
  data.append('table', table);
  let response = await fetch('list-upload.php', { method: 'post', body: data });
  response = await response.json();
  return response;
}

function enableUpload(file) {
  upload_field.classList.add('active');
  upload_fieldtext.textContent = file.name;
  if (upload_button.hasAttribute('disabled')) enableElement(upload_button);
}

function disableUpload() {
  // form
  upload_form.reset();
  upload_field.classList.remove('active');
  upload_fieldtext.textContent = 'Buscar Lista';
  disableElement(upload_button);
}

function startUploading() {
  // field
  upload_field.classList.add('uploading');
  upload_fieldtext.textContent = 'Uploading...';
  // button
  disableElement(upload_button);
  upload_button.classList.add('uploading');
  cambiarIcono(upload_icon, 'fa-paper-plane', ['fa-cog', 'fa-spin']);
}

function finishUploading() {
  // field
  upload_field.classList.remove('uploading');
  // button
  upload_button.classList.remove('uploading');
  cambiarIcono(upload_icon, ['fa-cog', 'fa-spin'], 'fa-paper-plane');
}

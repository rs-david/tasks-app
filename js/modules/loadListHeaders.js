/* CAMBIAR HEADERS */

import { actions_header, headerslist } from "./elementos.js";
import { _tables } from "./variables.js";

export function loadListHeaders(table) {
  /* Ocultar Headers Permanentes */
  const permanentheaders = document.querySelectorAll('#headers .header.perm-header');
  if (permanentheaders) for (const permheader of permanentheaders) permheader.classList.add('display-none');

  /* Eliminar Headers Temporales */
  const temporaryheaders = document.querySelectorAll('#headers .header.temp-header');
  if (temporaryheaders) for (const tempheader of temporaryheaders) tempheader.remove();

  /* Crear Headers Nuevos */
  const headernames = _tables[table].headers;
  const newtempheaders = [];
  if (headernames.length > 0) {
    for (const headername of headernames) {
      const newtempheader = createHeader(headername, table);
      newtempheaders.push(newtempheader);
    }
  }

  /* Mostrar Headers Permanentes */
  if (permanentheaders) for (const permheader of permanentheaders) permheader.classList.remove('display-none');

  /* Agregar Headers Nuevos */
  if (newtempheaders.length > 0) {
    for (const newtempheader of newtempheaders) {
      headerslist.insertBefore(newtempheader, actions_header);
    }
  }
}


function createHeader(headername, table) {
  /* Crear Header */
  const tempheader = document.createElement('li');
  tempheader.className = `header ${headername}-header temp-header`;

  /* Crear Header Link */
  const tempheaderlink = document.createElement('a');
  tempheaderlink.id = `${headername}-header`;
  const activeclass = headername == _tables[table].list.column ? 'active' : '';
  const sortclass = activeclass == 'active' && _tables[table].list.sort == 'ASC' ? 'ascendente' : activeclass == 'active' && _tables[table].list.sort == 'DESC' ? 'descendente' : '';
  tempheaderlink.className = `header-link ${activeclass} ${sortclass}`;
  tempheaderlink.name = `${headername}`;
  tempheaderlink.href = ``;
  const tempheadertitle = headername == 'id' ? 'Clave' : headername == 'name' ? 'Nombre' : headername == 'description' ? 'Descripción' : headername == 'price' ? 'Precio' : headername == 'created' ? 'Creado' : headername;
  tempheaderlink.title = `Ordenar × ${tempheadertitle}`;
  const tempheadertext = headername == 'id' ? '#' : headername == 'name' ? 'Nombre' : headername == 'description' ? 'Descripción' : headername == 'price' ? 'Precio' : headername == 'created' ? 'Creado' : headername;
  tempheaderlink.textContent = tempheadertext;

  /* Insertar Header Link en Header */
  tempheader.appendChild(tempheaderlink);

  return tempheader;
}

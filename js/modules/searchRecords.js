/* SEARCH RECORDS MODULE */
// Search Records = Filter Records
// Filter Records = List Records + Search Data

//* ------------------------------------------------------------------------------------- Imports *//
import { search_form } from "./elementos.js";
import { listRecords } from "./listRecords.js";

//* ------------------------------------------------------------------------------------- Events *//
search_form.addEventListener('search', () => {
    const searchdata = jsonFormData(search_form);
    listRecords(false, searchdata);
});
search_form.addEventListener('keyup', e => {
    if (e.target.nodeName == 'INPUT') {
        const searchdata = jsonFormData(search_form);
        listRecords(false, searchdata);
    }
});

//* ------------------------------------------------------------------------------------- Functions *//
export function jsonFormData(form) {
    const jsonfd = {};
    const formdata = new FormData(form);
    for (const [key, value] of formdata) jsonfd[key] = value;
    return jsonfd;
}

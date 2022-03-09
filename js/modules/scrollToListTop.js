/* SCROLL TO TOP OF THE LIST MODULE */

//* ------------------------------------------------------------------------------------- Imports *//
import { cards_container, top_list_button } from "./elementos.js";

//* ------------------------------------------------------------------------------------- Events *//
top_list_button.addEventListener('click', e => {
    cards_container.scrollTop = 0;
    e.preventDefault();
});

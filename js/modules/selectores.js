/* Selectores */
export function $(cssSelector) {
    return document.querySelector(`${cssSelector}`);
}

export function $$(cssSelector) {
    return document.querySelectorAll(`${cssSelector}`);
}

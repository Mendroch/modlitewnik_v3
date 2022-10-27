// Zwraca element o określonym identyfikatorze
const _getDOMElem = (attribute, value) => {
    return document.querySelector(`[${attribute}="${value}"]`)
}

// Przypisuje elementy do obiektu viewElems
export const mapListToDOMElements = (listOfValues, attribute) => {
    const _viewElems = {}

    for (const value of listOfValues) {
        _viewElems[value] = _getDOMElem(attribute, value)
    }

    return _viewElems
}

// Tworzy element drzewa DOM
export const createDOMElem = (tagName, className, innerText, src, innerHTML) => {
    const tag = document.createElement(tagName)
    tag.classList = className

    if (innerText) tag.innerText = innerText
    if (src) tag.src = src
    if (innerHTML) tag.innerHTML = innerHTML

    return tag
}

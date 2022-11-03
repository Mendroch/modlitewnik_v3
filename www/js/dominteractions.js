// Tworzy element drzewa DOM
export const createDOMElem = (tagName, className, innerText, href) => {
    const tag = document.createElement(tagName)
    tag.classList = className
    tag.innerText = innerText
    if(href) tag.href = href

    return tag
}
